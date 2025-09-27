import 'package:flutter/material.dart';

class MentorProfile extends StatelessWidget {
  final String name;
  final String bio;
  final List<String> skills;
  final bool verified;
  final String email;
  final String phone;

  MentorProfile({
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
      backgroundColor: Colors.grey[100],
      appBar: AppBar(
        title: Text("$name Profile"),
        backgroundColor: Colors.indigo,
        elevation: 0,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Profile Header
            Row(
              children: [
                CircleAvatar(
                  radius: 45,
                  backgroundColor: Colors.indigo.shade100,
                  child: Text(
                    name[0],
                    style: const TextStyle(
                      fontSize: 32,
                      fontWeight: FontWeight.bold,
                      color: Colors.indigo,
                    ),
                  ),
                ),
                const SizedBox(width: 20),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        name,
                        style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                      ),
                      if (verified)
                        Row(
                          children: const [
                            Icon(Icons.verified, color: Colors.blue, size: 22),
                            SizedBox(width: 4),
                            Text(
                              "Verified",
                              style: TextStyle(color: Colors.blue, fontWeight: FontWeight.w500),
                            ),
                          ],
                        ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),

            // Bio Card
            Card(
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              elevation: 3,
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text("Bio", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
                    const SizedBox(height: 6),
                    Text(bio, style: const TextStyle(fontSize: 16, height: 1.4)),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Skills Card
            Card(
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              elevation: 3,
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text("Skills", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
                    const SizedBox(height: 8),
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: skills
                          .map((skill) => Chip(
                                label: Text(skill),
                                backgroundColor: Colors.indigo.shade50,
                                labelStyle: const TextStyle(color: Colors.indigo),
                              ))
                          .toList(),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Contact Card
            Card(
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              elevation: 3,
              child: Padding(
                padding: const EdgeInsets.all(8.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Padding(
                      padding: EdgeInsets.all(8.0),
                      child: Text("Contact Information",
                          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
                    ),
                    ListTile(
                      leading: const Icon(Icons.email, color: Colors.indigo),
                      title: Text(email),
                    ),
                    ListTile(
                      leading: const Icon(Icons.phone, color: Colors.indigo),
                      title: Text(phone),
                    ),
                  ],
                ),
              ),
            ),
            const Spacer(),

            // Gradient Send Message Button
            Center(
              child: ElevatedButton.icon(
                onPressed: () {},
                icon: const Icon(Icons.message),
                label: const Text("Send Message"),
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 14),
                  backgroundColor: Colors.indigo,
                  textStyle: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
