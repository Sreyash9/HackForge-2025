class UserModel {
  final String uid;
  final String name;
  final String email;
  final String location;
  final List<String> interests;
  final String userType; // 'student' or 'mentor'
  final DateTime createdAt;
  final String? bio;
  final String? graduationYear; // Only for mentors
  final String? phone;

  UserModel({
    required this.uid,
    required this.name,
    required this.email,
    required this.location,
    required this.interests,
    required this.userType,
    required this.createdAt,
    this.bio,
    this.graduationYear,
    this.phone,
  });

  // Convert UserModel to Map for Firestore
  Map<String, dynamic> toMap() {
    return {
      'uid': uid,
      'name': name,
      'email': email,
      'location': location,
      'interests': interests,
      'userType': userType,
      'createdAt': createdAt.toIso8601String(),
      'phone': phone,
      'bio': bio,
      if (graduationYear != null) 'graduationYear': graduationYear,
    };
  }

  // Create UserModel from Firestore Map
  static UserModel fromMap(Map<String, dynamic> map) {
    return UserModel(
      uid: map['uid'] ?? '',
      name: map['name'] ?? '',
      email: map['email'] ?? '',
      location: map['location'] ?? '',
      interests: List<String>.from(map['interests'] ?? []),
      userType: map['userType'] ?? '',
      createdAt: DateTime.parse(
        map['createdAt'] ?? DateTime.now().toIso8601String(),
      ),
      bio: map['bio'],
      graduationYear: map['graduationYear'],
    );
  }

  // Create a copy of UserModel with updated fields
  UserModel copyWith({
    String? uid,
    String? name,
    String? email,
    String? location,
    List<String>? interests,
    String? userType,
    DateTime? createdAt,
    String? bio,
    String? graduationYear,
  }) {
    return UserModel(
      uid: uid ?? this.uid,
      name: name ?? this.name,
      email: email ?? this.email,
      location: location ?? this.location,
      interests: interests ?? this.interests,
      userType: userType ?? this.userType,
      createdAt: createdAt ?? this.createdAt,
      bio: bio ?? this.bio,
      graduationYear: graduationYear ?? this.graduationYear,
    );
  }

  @override
  String toString() {
    return 'UserModel(uid: $uid, name: $name, email: $email, userType: $userType)';
  }
}
