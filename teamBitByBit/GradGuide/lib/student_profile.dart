import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'chat_screen.dart'; // your chat UI
import 'utility/chat_utils.dart'; // for getChatId()

class StudentProfile extends StatelessWidget {
  final String uid; // student's uid
  final String name;
  final String bio;
  final List<String> skills;
  final String email;
  final String phone;

  const StudentProfile({
    super.key,
    required this.uid,
    required this.name,
    required this.bio,
    required this.skills,
    required this.email,
    required this.phone,
  });

  @override
  Widget build(BuildContext context) {
    final currentUser = FirebaseAuth.instance.currentUser;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Student Profile'),
        backgroundColor: Colors.teal,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Avatar + Name
            Center(
              child: CircleAvatar(
                radius: 50,
                backgroundColor: Colors.teal.shade100,
                child: Text(
                  name[0].toUpperCase(),
                  style: const TextStyle(
                      fontSize: 40, fontWeight: FontWeight.bold, color: Colors.teal),
                ),
              ),
            ),
            const SizedBox(height: 16),
            Center(
              child: Text(
                name,
                style: const TextStyle(
                    fontSize: 26, fontWeight: FontWeight.bold, color: Colors.teal),
              ),
            ),
            const SizedBox(height: 20),

            // Bio & Skills
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(12),
                  boxShadow: [
                    BoxShadow(
                        color: Colors.grey.shade300,
                        blurRadius: 8,
                        offset: const Offset(0, 3))
                  ]),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text("Bio", style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600)),
                  const SizedBox(height: 6),
                  Text(bio, style: const TextStyle(fontSize: 16)),
                  const SizedBox(height: 16),
                  const Text("Skills", style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600)),
                  const SizedBox(height: 8),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: skills
                        .map((skill) => Chip(
                              label: Text(skill),
                              backgroundColor: Colors.teal.shade50,
                            ))
                        .toList(),
                  ),
                  const SizedBox(height: 16),
                  Text("Email: $email", style: const TextStyle(fontSize: 16)),
                  const SizedBox(height: 6),
                  Text("Phone: $phone", style: const TextStyle(fontSize: 16)),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Progress Tracker
            Text(
              'Progress Tracker',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Colors.teal.shade700),
            ),
            const SizedBox(height: 10),
            StreamBuilder<QuerySnapshot>(
              stream: FirebaseFirestore.instance
                  .collection('progress')
                  .doc(uid)
                  .collection('tasks')
                  .snapshots(),
              builder: (context, snapshot) {
                if (!snapshot.hasData) return const CircularProgressIndicator();
                final tasks = snapshot.data!.docs;

                if (tasks.isEmpty) {
                  return const Text('No tasks assigned yet.');
                }

                return Column(
                  children: tasks.map((taskDoc) {
                    final task = taskDoc.data() as Map<String, dynamic>;
                    return ListTile(
                      title: Text(task['title'] ?? 'Untitled Task'),
                      subtitle: Text('Status: ${task['status'] ?? 'pending'}'),
                      trailing: Icon(
                        task['status'] == 'completed'
                            ? Icons.check_circle
                            : Icons.circle_outlined,
                        color: task['status'] == 'completed' ? Colors.green : Colors.grey,
                      ),
                    );
                  }).toList(),
                );
              },
            ),

            const SizedBox(height: 20),

            // Chat Button
            Center(
              child: ElevatedButton.icon(
                onPressed: () {
                  if (currentUser != null) {
                   Navigator.push(
  context,
  MaterialPageRoute(
    builder: (_) => ChatScreen(
      chatId: getChatId(uid, currentUser.uid),
      currentUserId: currentUser.uid,
      peerId: uid,       // <-- required
      peerName: name,    // <-- required
    ),
  ),
);


                  }
                },
                icon: const Icon(Icons.chat),
                label: const Text('Chat with Student'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.teal,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
