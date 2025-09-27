import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import '../models/mentor_request.dart';
import '../models/user_model.dart';

class MentorRequestService {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  final FirebaseAuth _auth = FirebaseAuth.instance;

  // Send a mentor request
  Future<void> sendMentorRequest({
    required String mentorId,
    required String mentorName,
    String? message,
  }) async {
    try {
      final currentUser = _auth.currentUser;
      if (currentUser == null) throw Exception('User not authenticated');

      // Get current user's document to get their name
      final userDoc = await _firestore
          .collection('users')
          .doc(currentUser.uid)
          .get();
      final userData = UserModel.fromMap(
        userDoc.data() as Map<String, dynamic>,
      );

      final requestId = _firestore.collection('mentor_requests').doc().id;

      final request = MentorRequest(
        id: requestId,
        studentId: currentUser.uid,
        mentorId: mentorId,
        studentName: userData.name,
        mentorName: mentorName,
        status: 'pending',
        createdAt: DateTime.now(),
        message: message,
      );

      await _firestore
          .collection('mentor_requests')
          .doc(requestId)
          .set(request.toMap());
    } catch (e) {
      throw Exception('Error sending mentor request: ${e.toString()}');
    }
  }

  // Get mentor requests for a specific mentor (notifications)
  Stream<List<MentorRequest>> getMentorRequests(String mentorId) {
    return _firestore
        .collection('mentor_requests')
        .where('mentorId', isEqualTo: mentorId)
        .where('status', isEqualTo: 'pending')
        .snapshots()
        .map(
          (snapshot) =>
              snapshot.docs
                  .map((doc) => MentorRequest.fromMap(doc.data()))
                  .toList()
                ..sort(
                  (a, b) => b.createdAt.compareTo(a.createdAt),
                ), // Sort in memory
        );
  }

  // Get student's mentor requests status
  Stream<List<MentorRequest>> getStudentRequests(String studentId) {
    return _firestore
        .collection('mentor_requests')
        .where('studentId', isEqualTo: studentId)
        .snapshots()
        .map(
          (snapshot) =>
              snapshot.docs
                  .map((doc) => MentorRequest.fromMap(doc.data()))
                  .toList()
                ..sort(
                  (a, b) => b.createdAt.compareTo(a.createdAt),
                ), // Sort in memory
        );
  }

  // Accept mentor request
  Future<void> acceptMentorRequest(String requestId) async {
    try {
      await _firestore.collection('mentor_requests').doc(requestId).update({
        'status': 'accepted',
      });
    } catch (e) {
      throw Exception('Error accepting request: ${e.toString()}');
    }
  }

  // Reject mentor request
  Future<void> rejectMentorRequest(String requestId) async {
    try {
      await _firestore.collection('mentor_requests').doc(requestId).update({
        'status': 'rejected',
      });
    } catch (e) {
      throw Exception('Error rejecting request: ${e.toString()}');
    }
  }

  // Get accepted mentors for a student
  Stream<List<UserModel>> getAcceptedMentors(String studentId) {
    return _firestore
        .collection('mentor_requests')
        .where('studentId', isEqualTo: studentId)
        .where('status', isEqualTo: 'accepted')
        .snapshots()
        .asyncMap((snapshot) async {
          List<UserModel> mentors = [];
          for (var doc in snapshot.docs) {
            final request = MentorRequest.fromMap(doc.data());
            final mentorDoc = await _firestore
                .collection('users')
                .doc(request.mentorId)
                .get();
            if (mentorDoc.exists) {
              mentors.add(
                UserModel.fromMap(mentorDoc.data() as Map<String, dynamic>),
              );
            }
          }
          return mentors;
        });
  }

  // Get accepted students for a mentor (stream)
  Stream<List<UserModel>> getAcceptedStudents(String mentorId) {
    return _firestore
        .collection('mentor_requests')
        .where('mentorId', isEqualTo: mentorId)
        .where('status', isEqualTo: 'accepted')
        .snapshots()
        .asyncMap((snapshot) async {
          List<UserModel> students = [];
          for (var doc in snapshot.docs) {
            final request = MentorRequest.fromMap(doc.data());
            final studentDoc = await _firestore
                .collection('users')
                .doc(request.studentId)
                .get();
            if (studentDoc.exists) {
              students.add(
                UserModel.fromMap(studentDoc.data() as Map<String, dynamic>),
              );
            }
          }
          return students;
        });
  }

  // Get accepted students once (Future) for progress tracker
  Future<List<UserModel>> getAcceptedStudentsOnce(String mentorId) async {
    final snapshot = await getAcceptedStudents(mentorId).first;
    return snapshot;
  }

  // Check if request already exists
  Future<bool> hasExistingRequest(String studentId, String mentorId) async {
    try {
      final querySnapshot = await _firestore
          .collection('mentor_requests')
          .where('studentId', isEqualTo: studentId)
          .where('mentorId', isEqualTo: mentorId)
          .where('status', whereIn: ['pending', 'accepted'])
          .get();

      return querySnapshot.docs.isNotEmpty;
    } catch (e) {
      return false;
    }
  }

  // Get matching mentors based on interests and location
  Future<List<UserModel>> getMatchingMentors({
    required List<String> studentInterests,
    required String studentLocation,
    required bool onlineMode,
  }) async {
    try {
      Query mentorsQuery = _firestore
          .collection('users')
          .where('userType', isEqualTo: 'mentor');

      final querySnapshot = await mentorsQuery.get();

      List<UserModel> allMentors = querySnapshot.docs
          .map((doc) => UserModel.fromMap(doc.data() as Map<String, dynamic>))
          .toList();

      // Filter mentors based on interests and location
      List<UserModel> matchingMentors = allMentors.where((mentor) {
        // Check for common interests
        bool hasCommonInterests = mentor.interests.any(
          (skill) => studentInterests.contains(skill),
        );

        if (onlineMode) {
          return hasCommonInterests;
        } else {
          // Offline mode: check location similarity
          bool locationMatch = _isLocationSimilar(
            mentor.location,
            studentLocation,
          );
          return hasCommonInterests && locationMatch;
        }
      }).toList();

      // Sort by number of common interests
      matchingMentors.sort((a, b) {
        int aCommon = a.interests
            .where((skill) => studentInterests.contains(skill))
            .length;
        int bCommon = b.interests
            .where((skill) => studentInterests.contains(skill))
            .length;
        return bCommon.compareTo(aCommon);
      });

      return matchingMentors;
    } catch (e) {
      throw Exception('Error getting matching mentors: ${e.toString()}');
    }
  }

  // Simple location similarity check
  bool _isLocationSimilar(String mentorLocation, String studentLocation) {
    if (mentorLocation.toLowerCase() == studentLocation.toLowerCase()) {
      return true;
    }

    // Check if locations contain similar words
    List<String> mentorWords = mentorLocation.toLowerCase().split(' ');
    List<String> studentWords = studentLocation.toLowerCase().split(' ');

    return mentorWords.any((word) => studentWords.contains(word));
  }
}
