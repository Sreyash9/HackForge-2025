import 'package:cloud_firestore/cloud_firestore.dart';

class TaskService {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  // Assign task to student
  Future<void> assignTask({
    required String studentId,
    required String title,
    String? description,
    required String mentorId,
  }) async {
    final taskRef = _firestore.collection('progress').doc(studentId).collection('tasks').doc();
    await taskRef.set({
      'title': title,
      'description': description ?? '',
      'status': 'pending',
      'assignedBy': mentorId,
      'timestamp': FieldValue.serverTimestamp(),
    });
  }

  // Update task status
  Future<void> updateTaskStatus({
    required String studentId,
    required String taskId,
    required String status,
  }) async {
    await _firestore.collection('progress').doc(studentId).collection('tasks').doc(taskId)
        .update({'status': status});
  }

  // Stream tasks for a student
  Stream<List<Map<String, dynamic>>> getTasksForStudent(String studentId) {
    return _firestore
        .collection('progress')
        .doc(studentId)
        .collection('tasks')
        .orderBy('timestamp', descending: true)
        .snapshots()
        .map((snapshot) =>
            snapshot.docs.map((doc) => {'id': doc.id, ...doc.data()}).toList());
  }
}
