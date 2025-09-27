import 'package:flutter/material.dart';
import 'package:syncfusion_flutter_charts/charts.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'stories.dart';
import 'utils/logout_helper.dart';
import 'services/mentor_request_service.dart';
import 'models/user_model.dart';
import 'models/mentor_request.dart';
import 'pages/add_mentor_page.dart';
import 'widgets/request_status_card.dart';

// Import chat screen and helper
import 'chat_screen.dart';
import 'utility/chat_utils.dart';

void main() {
  runApp(StudentDashboardApp());
}

class StudentDashboardApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Student Dashboard',
      theme: ThemeData(
        primarySwatch: Colors.teal,
        scaffoldBackgroundColor: Color(0xFFF0F2F5),
      ),
      home: StudentDashboard(),
      debugShowCheckedModeBanner: false,
    );
  }
}

class StudentDashboard extends StatefulWidget {
  @override
  State<StudentDashboard> createState() => _StudentDashboardState();
}

class _StudentDashboardState extends State<StudentDashboard> {
  final _mentorRequestService = MentorRequestService();

  @override
  Widget build(BuildContext context) {
    final currentUser = FirebaseAuth.instance.currentUser;

    if (currentUser == null) {
      return Scaffold(
        body: Center(child: Text('Please login to access the dashboard')),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: Text('My Mentors'),
        elevation: 0,
        backgroundColor: Colors.teal.shade600,
        actions: [
          IconButton(
            icon: Icon(Icons.list_alt),
            tooltip: "Stories",
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => StoriesPage()),
              );
            },
          ),
          IconButton(
            icon: Icon(Icons.track_changes),
            tooltip: "Progress Tracker",
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => ProgressTracker()),
              );
            },
          ),
          IconButton(
            icon: Icon(Icons.logout),
            tooltip: "Logout",
            onPressed: () {
              LogoutHelper.showLogoutDialog(context);
            },
          ),
        ],
      ),

      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => const AddMentorPage()),
          );
        },
        backgroundColor: Colors.teal.shade600,
        icon: const Icon(Icons.person_add),
        label: const Text('Find Mentors'),
      ),

      body: SingleChildScrollView(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // My Mentors Section
            Row(
              children: [
                Icon(Icons.people, color: Colors.teal.shade600),
                SizedBox(width: 8),
                Text(
                  "My Mentors",
                  style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    color: Colors.teal.shade900,
                  ),
                ),
              ],
            ),
            SizedBox(height: 16),

            StreamBuilder<List<UserModel>>(
              stream: _mentorRequestService.getAcceptedMentors(currentUser.uid),
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return Center(child: CircularProgressIndicator());
                }

                if (snapshot.hasError) {
                  return Container(
                    padding: EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.red.shade50,
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      'Error loading mentors: ${snapshot.error}',
                      style: TextStyle(color: Colors.red.shade700),
                    ),
                  );
                }

                final mentors = snapshot.data ?? [];

                // Sort mentors by graduation year (latest first)
                mentors.sort((a, b) {
  final aYear = a.graduationYear is int ? a.graduationYear as int : 0;
  final bYear = b.graduationYear is int ? b.graduationYear as int : 0;
  return bYear.compareTo(aYear); // descending
});


                if (mentors.isEmpty) {
                  return Container(
                    padding: EdgeInsets.all(32),
                    decoration: BoxDecoration(
                      color: Colors.grey.shade100,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: Colors.grey.shade300),
                    ),
                    child: Column(
                      children: [
                        Icon(
                          Icons.person_search,
                          size: 48,
                          color: Colors.grey.shade400,
                        ),
                        SizedBox(height: 16),
                        Text(
                          'No mentors yet',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                            color: Colors.grey.shade600,
                          ),
                        ),
                        SizedBox(height: 8),
                        Text(
                          'Start by finding mentors who share your interests!',
                          style: TextStyle(
                            fontSize: 14,
                            color: Colors.grey.shade500,
                          ),
                          textAlign: TextAlign.center,
                        ),
                        SizedBox(height: 16),
                        ElevatedButton.icon(
                          onPressed: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) => const AddMentorPage(),
                              ),
                            );
                          },
                          icon: Icon(Icons.search),
                          label: Text('Find Mentors'),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.teal.shade600,
                          ),
                        ),
                      ],
                    ),
                  );
                }

                return ListView.builder(
                  shrinkWrap: true,
                  physics: NeverScrollableScrollPhysics(),
                  itemCount: mentors.length,
                  itemBuilder: (context, index) {
                    return MentorCard(
                      mentor: mentors[index],
                      currentUserId: currentUser.uid,
                    );
                  },
                );
              },
            ),

            SizedBox(height: 32),

            // Request Status Section
            Row(
              children: [
                Icon(Icons.notifications, color: Colors.orange.shade600),
                SizedBox(width: 8),
                Text(
                  "Request Status",
                  style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    color: Colors.teal.shade900,
                  ),
                ),
              ],
            ),
            SizedBox(height: 16),

            StreamBuilder<List<MentorRequest>>(
              stream: _mentorRequestService.getStudentRequests(currentUser.uid),
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return Center(child: CircularProgressIndicator());
                }

                final requests = snapshot.data ?? [];
                final pendingRequests = requests
                    .where((r) => r.status == 'pending')
                    .toList();
                final rejectedRequests = requests
                    .where((r) => r.status == 'rejected')
                    .toList();

                if (requests.isEmpty) {
                  return Container(
                    padding: EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.grey.shade100,
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      'No mentor requests sent yet',
                      style: TextStyle(
                        color: Colors.grey.shade600,
                        fontSize: 14,
                      ),
                      textAlign: TextAlign.center,
                    ),
                  );
                }

                return Column(
                  children: [
                    if (pendingRequests.isNotEmpty) ...[
                      ...pendingRequests.map(
                        (request) => RequestStatusCard(
                          request: request,
                          color: Colors.orange.shade100,
                          icon: Icons.hourglass_empty,
                          iconColor: Colors.orange.shade700,
                        ),
                      ),
                      SizedBox(height: 8),
                    ],
                    if (rejectedRequests.isNotEmpty) ...[
                      ...rejectedRequests
                          .take(3)
                          .map(
                            (request) => RequestStatusCard(
                              request: request,
                              color: Colors.red.shade100,
                              icon: Icons.close,
                              iconColor: Colors.red.shade700,
                            ),
                          ),
                    ],
                  ],
                );
              },
            ),

            SizedBox(height: 24),
            Text(
              "Progress Overview",
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: Colors.teal.shade900,
              ),
            ),
            SizedBox(height: 16),
            ProgressTracker(),
          ],
        ),
      ),
    );
  }
}

// Clean Mentor Card for UserModel
class MentorCard extends StatelessWidget {
  final UserModel mentor;
  final String currentUserId;

  const MentorCard({super.key, required this.mentor, required this.currentUserId});

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: EdgeInsets.symmetric(vertical: 10),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      elevation: 5,
      shadowColor: Colors.grey.shade300,
      child: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [Colors.teal.shade50, Colors.white],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
          borderRadius: BorderRadius.circular(20),
        ),
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  CircleAvatar(
                    radius: 28,
                    backgroundColor: Colors.teal.shade100,
                    child: Text(
                      mentor.name[0].toUpperCase(),
                      style: TextStyle(
                        color: Colors.teal.shade900,
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Expanded(
                              child: Text(
                                mentor.name,
                                style: TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.teal.shade900,
                                ),
                              ),
                            ),
                            Icon(Icons.verified, color: Colors.green, size: 18),
                          ],
                        ),
                        SizedBox(height: 4),
                        Text(
                          mentor.location,
                          style: TextStyle(
                            fontSize: 14,
                            color: Colors.grey.shade600,
                          ),
                        ),
                        if (mentor.graduationYear != null)
                          Text(
                            'Class of ${mentor.graduationYear}',
                            style: TextStyle(
                              fontSize: 12,
                              color: Colors.grey.shade500,
                            ),
                          ),
                      ],
                    ),
                  ),
                ],
              ),

              if (mentor.bio != null && mentor.bio!.isNotEmpty) ...[
                SizedBox(height: 12),
                Text(
                  mentor.bio!,
                  style: TextStyle(fontSize: 14, color: Colors.teal.shade700),
                ),
              ],

              SizedBox(height: 16),
              Text(
                'Expertise:',
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.bold,
                  color: Colors.teal.shade900,
                ),
              ),
              SizedBox(height: 8),
              Wrap(
                children: mentor.interests
                    .map(
                      (skill) => Padding(
                        padding: EdgeInsets.only(right: 8, bottom: 8),
                        child: Chip(
                          backgroundColor: Colors.teal.shade100,
                          label: Text(
                            skill,
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
                              color: Colors.teal.shade800,
                            ),
                          ),
                        ),
                      ),
                    )
                    .toList(),
              ),
              SizedBox(height: 16),
              Row(
                children: [
                  Expanded(
                    child: ElevatedButton.icon(
                      onPressed: () {
                        // Compute chatId using helper
                        final chatId = getChatId(currentUserId, mentor.uid);

                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => ChatScreen(
                              chatId: chatId,
                              currentUserId: currentUserId,
                              peerId: mentor.uid,
                              peerName: mentor.name,
                            ),
                          ),
                        );
                      },
                      icon: Icon(Icons.chat, size: 16),
                      label: Text("Chat"),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.teal.shade600,
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(30),
                        ),
                      ),
                    ),
                  ),

                  SizedBox(width: 12),
                  Expanded(
                    child: OutlinedButton.icon(
                      onPressed: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(content: Text('Profile view coming soon!')),
                        );
                      },
                      icon: Icon(Icons.person, size: 16),
                      label: Text("Profile"),
                      style: OutlinedButton.styleFrom(
                        foregroundColor: Colors.teal.shade700,
                        side: BorderSide(color: Colors.teal.shade300),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(30),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// Progress Tracker Widget
class ProgressTracker extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            Text(
              "Learning Progress",
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: Colors.teal.shade800,
              ),
            ),
            SizedBox(height: 16),
            SfCircularChart(
              series: <CircularSeries>[
                PieSeries<ChartData, String>(
                  dataSource: [
                    ChartData('Completed', 65, Colors.green),
                    ChartData('In Progress', 20, Colors.orange),
                    ChartData('Remaining', 15, Colors.grey),
                  ],
                  xValueMapper: (ChartData data, _) => data.category,
                  yValueMapper: (ChartData data, _) => data.value,
                  pointColorMapper: (ChartData data, _) => data.color,
                  dataLabelSettings: DataLabelSettings(isVisible: true),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class ChartData {
  ChartData(this.category, this.value, this.color);
  final String category;
  final int value;
  final Color color;
}
