class MentorRequest {
  final String id;
  final String studentId;
  final String mentorId;
  final String studentName;
  final String mentorName;
  final String status; // 'pending', 'accepted', 'rejected'
  final DateTime createdAt;
  final String? message;

  MentorRequest({
    required this.id,
    required this.studentId,
    required this.mentorId,
    required this.studentName,
    required this.mentorName,
    required this.status,
    required this.createdAt,
    this.message,
  });

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'studentId': studentId,
      'mentorId': mentorId,
      'studentName': studentName,
      'mentorName': mentorName,
      'status': status,
      'createdAt': createdAt.toIso8601String(),
      'message': message,
    };
  }

  static MentorRequest fromMap(Map<String, dynamic> map) {
    return MentorRequest(
      id: map['id'] ?? '',
      studentId: map['studentId'] ?? '',
      mentorId: map['mentorId'] ?? '',
      studentName: map['studentName'] ?? '',
      mentorName: map['mentorName'] ?? '',
      status: map['status'] ?? 'pending',
      createdAt: DateTime.parse(
        map['createdAt'] ?? DateTime.now().toIso8601String(),
      ),
      message: map['message'],
    );
  }

  MentorRequest copyWith({
    String? id,
    String? studentId,
    String? mentorId,
    String? studentName,
    String? mentorName,
    String? status,
    DateTime? createdAt,
    String? message,
  }) {
    return MentorRequest(
      id: id ?? this.id,
      studentId: studentId ?? this.studentId,
      mentorId: mentorId ?? this.mentorId,
      studentName: studentName ?? this.studentName,
      mentorName: mentorName ?? this.mentorName,
      status: status ?? this.status,
      createdAt: createdAt ?? this.createdAt,
      message: message ?? this.message,
    );
  }
}
