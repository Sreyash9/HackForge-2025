import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'utils/logout_helper.dart';
import 'pages/notifications_page.dart';
import 'services/mentor_request_service.dart';
import 'services/firebase_auth_service.dart';
import 'models/user_model.dart';
import 'chat_screen.dart';

class MentorProfile extends StatelessWidget {
  final String name;
  final String bio;
  final List<String> skills;
  final bool verified;
  final String email;
  final String phone;

  const MentorProfile({
    super.key,
    required this.name,
    required this.bio,
    required this.skills,
    required this.verified,
    required this.email,
    required this.phone,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Mentor Profile"),
        backgroundColor: Colors.teal,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(name, style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            Text(bio),
            const SizedBox(height: 8),
            Text("Skills: ${skills.join(", ")}"),
            const SizedBox(height: 8),
            Text("Email: $email"),
            Text("Phone: $phone"),
          ],
        ),
      ),
    );
  }
}

// ---------------------- PostStoryPage ----------------------
class PostStoryPage extends StatefulWidget {
  const PostStoryPage({super.key});

  @override
  State<PostStoryPage> createState() => _PostStoryPageState();
}

class _PostStoryPageState extends State<PostStoryPage> {
  final _formKey = GlobalKey<FormState>();
  final _storyController = TextEditingController();
  bool _loading = false;

  Future<void> _postStory() async {
  if (!_formKey.currentState!.validate()) return;

  setState(() => _loading = true);

  final currentUser = FirebaseAuth.instance.currentUser;
  if (currentUser == null) {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('You must be logged in to post a story.')),
    );
    setState(() => _loading = false);
    return;
  }

  try {
    final userDoc = await FirebaseFirestore.instance
        .collection('users')
        .doc(currentUser.uid)
        .get();

    if (!userDoc.exists) throw Exception('User data not found');

    final userData = UserModel.fromMap(userDoc.data()!);

    final storyData = {
      'mentorId': currentUser.uid,
      'mentorName': userData.name,
      'text': _storyController.text.trim(),
      'createdAt': FieldValue.serverTimestamp(),
    };

    // Use add() instead of set(doc()) to avoid hanging due to doc creation
    await FirebaseFirestore.instance.collection('stories').add(storyData);

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Story posted successfully!')),
    );

    Navigator.pop(context);
  } catch (e) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Error posting story: $e')),
    );
  } finally {
    setState(() => _loading = false);
  }
}


  @override
  void dispose() {
    _storyController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Post Story'), backgroundColor: Colors.teal),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              TextFormField(
                controller: _storyController,
                maxLines: 5,
                decoration: const InputDecoration(
                  labelText: 'Your Story or Tip',
                  border: OutlineInputBorder(),
                ),
                validator: (val) => val == null || val.trim().isEmpty ? 'Please enter a story' : null,
              ),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: _loading ? null : _postStory,
                child: _loading
                    ? const CircularProgressIndicator(color: Colors.white)
                    : const Text('Post Story'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.teal,
                  minimumSize: const Size(double.infinity, 50),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// ---------------------- Mentor Dashboard ----------------------
class MentorDashboard extends StatefulWidget {
  const MentorDashboard({super.key});

  @override
  State<MentorDashboard> createState() => _MentorDashboardState();
}

class _MentorDashboardState extends State<MentorDashboard> {
  final _mentorRequestService = MentorRequestService();
  final _authService = FirebaseAuthService();
  UserModel? _currentMentorData;

  @override
  void initState() {
    super.initState();
    _loadCurrentMentorData();
  }

  Future<void> _loadCurrentMentorData() async {
    final currentUser = FirebaseAuth.instance.currentUser;
    if (currentUser != null) {
      final mentorData = await _authService.getUserDocument(currentUser.uid);
      if (mounted) {
        setState(() {
          _currentMentorData = mentorData;
        });
      }
    }
  }

  String generateChatId(String userId1, String userId2) {
    return userId1.hashCode <= userId2.hashCode
        ? '${userId1}_$userId2'
        : '${userId2}_$userId1';
  }

  @override
  Widget build(BuildContext context) {
    final currentUser = FirebaseAuth.instance.currentUser;

    if (currentUser == null) {
      return const Scaffold(
        body: Center(child: Text('Please login to access the dashboard')),
      );
    }

    return Scaffold(
      backgroundColor: Colors.grey[50],
      appBar: AppBar(
        title: const Text('Mentor Dashboard'),
        backgroundColor: Colors.teal,
        elevation: 2,
        actions: [
          IconButton(
            icon: const Icon(Icons.post_add),
            tooltip: 'Post Story / Tip',
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => const PostStoryPage()),
              );
            },
          ),
          IconButton(
            icon: const Icon(Icons.person),
            tooltip: "View Mentor Profile",
            onPressed: () {
              if (_currentMentorData != null) {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => MentorProfile(
                      name: _currentMentorData!.name,
                      bio: _currentMentorData!.bio ?? "No bio available",
                      skills: _currentMentorData!.interests,
                      verified: true,
                      email: _currentMentorData!.email,
                      phone: "Not available",
                    ),
                  ),
                );
              }
            },
          ),
          IconButton(
            icon: const Icon(Icons.notifications),
            tooltip: "Notifications",
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => const NotificationsPage(),
                ),
              );
            },
          ),
          IconButton(
            icon: const Icon(Icons.track_changes),
            tooltip: "Progress Tracker",
            onPressed: () async {
              final students = await _mentorRequestService
                  .getAcceptedStudentsOnce(currentUser.uid);
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => ProgressTracker(students: students),
                ),
              );
            },
          ),
          IconButton(
            icon: const Icon(Icons.logout),
            tooltip: "Logout",
            onPressed: () {
              LogoutHelper.showLogoutDialog(context);
            },
          ),
        ],
      ),
      body: StreamBuilder<List<UserModel>>(
        stream: _mentorRequestService.getAcceptedStudents(currentUser.uid),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }

          if (snapshot.hasError) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.error_outline, size: 64, color: Colors.red.shade400),
                  const SizedBox(height: 16),
                  Text('Error loading students', style: TextStyle(fontSize: 18, color: Colors.grey.shade700)),
                  const SizedBox(height: 8),
                  Text(snapshot.error.toString(), style: TextStyle(fontSize: 14, color: Colors.grey.shade500), textAlign: TextAlign.center),
                ],
              ),
            );
          }

          final acceptedStudents = snapshot.data ?? [];

          if (acceptedStudents.isEmpty) {
            return Center(
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.school_outlined, size: 64, color: Colors.grey.shade400),
                    const SizedBox(height: 16),
                    Text('No students yet', style: TextStyle(fontSize: 20, color: Colors.grey.shade600)),
                    const SizedBox(height: 8),
                    Text('When you accept mentorship requests,\nstudents will appear here.', style: TextStyle(fontSize: 14, color: Colors.grey.shade500), textAlign: TextAlign.center),
                  ],
                ),
              ),
            );
          }

          return Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('My Students (${acceptedStudents.length})', style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Colors.teal)),
                const SizedBox(height: 16),
                Expanded(
                  child: ListView.separated(
                    itemCount: acceptedStudents.length,
                    separatorBuilder: (context, index) => const SizedBox(height: 12),
                    itemBuilder: (context, index) {
                      final student = acceptedStudents[index];

                      return Card(
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
                        elevation: 4,
                        margin: EdgeInsets.zero,
                        shadowColor: Colors.teal.shade100,
                        child: Padding(
                          padding: const EdgeInsets.all(16.0),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  CircleAvatar(
                                    radius: 25,
                                    backgroundColor: Colors.teal.shade100,
                                    child: Text(student.name[0].toUpperCase(), style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.teal, fontSize: 18)),
                                  ),
                                  const SizedBox(width: 12),
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text(student.name, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                                        const SizedBox(height: 4),
                                        Row(
                                          children: [
                                            Icon(Icons.location_on, size: 16, color: Colors.grey.shade600),
                                            const SizedBox(width: 4),
                                            Text(student.location, style: TextStyle(fontSize: 14, color: Colors.grey.shade600)),
                                          ],
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 16),
                              Row(
                                mainAxisAlignment: MainAxisAlignment.end,
                                children: [
                                  ElevatedButton.icon(
                                    onPressed: () {
                                      final chatId = generateChatId(currentUser.uid, student.uid);
                                      Navigator.push(
                                        context,
                                        MaterialPageRoute(
                                          builder: (context) => ChatScreen(chatId: chatId, currentUserId: currentUser.uid, peerId: student.uid, peerName: student.name),
                                        ),
                                      );
                                    },
                                    icon: const Icon(Icons.chat, size: 18),
                                    label: const Text('Chat'),
                                    style: ElevatedButton.styleFrom(backgroundColor: Colors.teal, foregroundColor: Colors.white),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}

// ---------------------- ProgressTracker ----------------------
class ProgressTracker extends StatelessWidget {
  final List<UserModel> students;

  const ProgressTracker({super.key, required this.students});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Students Progress'), backgroundColor: Colors.teal),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: students.length,
        itemBuilder: (context, index) {
          final student = students[index];
          // Fake progress for demo
          final completed = (student.interests.length % 100) + 1;
          return Card(
            margin: const EdgeInsets.only(bottom: 12),
            child: ListTile(
              title: Text(student.name),
              subtitle: LinearProgressIndicator(value: completed / 100),
              trailing: Text('${completed}%'),
            ),
          );
        },
      ),
    );
  }
}
