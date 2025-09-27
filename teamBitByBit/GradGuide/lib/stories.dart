import 'package:flutter/material.dart';

class Story {
  final String text;
  final List<String> tags;
  final String mentorName;
  final String location;
  final DateTime postedTime;

  Story({
    required this.text,
    required this.tags,
    required this.mentorName,
    required this.location,
    required this.postedTime,
  });
}

class StoriesPage extends StatelessWidget {
  final List<Story> stories = [
    Story(
      text:
          "I grew up in a small village with limited resources, but my determination and love for teaching helped me overcome every obstacle. Remember, hardships build character and bring strength.",
      tags: ["Inspiration", "Hardship", "Determination"],
      mentorName: "Dr. Ayesha Khan",
      location: "Lahore",
      postedTime: DateTime.now().subtract(Duration(days: 2)),
    ),
    Story(
      text:
          "Coming from a modest background, I faced financial issues throughout my education. With perseverance and guidance from mentors, I made it here to share my knowledge and inspire the next generation.",
      tags: ["Persistence", "Finance", "Mentorship"],
      mentorName: "John Patel",
      location: "Mumbai",
      postedTime: DateTime.now().subtract(Duration(days: 5)),
    ),
    Story(
      text:
          "As a first-generation college student, every exam and challenge seemed daunting. But I believed in lifelong learning and hope my story motivates you to push through your toughest moments.",
      tags: ["First-generation", "Learning", "Motivation"],
      mentorName: "Marie O’Connell",
      location: "Dublin",
      postedTime: DateTime.now().subtract(Duration(days: 4)),
    ),
    Story(
      text:
          "Balancing work, family, and studies was the hardest phase of my life. But the passion to mentor motivated me to continue. No matter where you come from, focus and passion will see you through.",
      tags: ["Balance", "Passion", "Focus"],
      mentorName: "Luis Hernandez",
      location: "Mexico City",
      postedTime: DateTime.now().subtract(Duration(days: 3)),
    ),
    Story(
      text:
          "I faced multiple rejections and setbacks, but I learned to see failures as stepping stones. To all students: your journey won’t be easy but is worth every struggle.",
      tags: ["Failure", "Growth", "Resilience"],
      mentorName: "Chen Wei",
      location: "Beijing",
      postedTime: DateTime.now().subtract(Duration(days: 1)),
    ),
  ];

  // A set of vibrant colors for the tags
  final List<Color> tagColors = [
    Colors.teal.shade100,
    Colors.orange.shade100,
    Colors.purple.shade100,
    Colors.green.shade100,
    Colors.pink.shade100,
    Colors.cyan.shade100,
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Mentor Stories"),
        backgroundColor: Colors.teal.shade600,
      ),
      body: ListView.builder(
        padding: EdgeInsets.all(12),
        itemCount: stories.length,
        itemBuilder: (context, index) {
          final story = stories[index];
          return Card(
            margin: EdgeInsets.symmetric(vertical: 10),
            shape:
                RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
            elevation: 6,
            shadowColor: Colors.grey.shade300,
            child: Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    Colors.white,
                    Colors.teal.shade50.withOpacity(0.3),
                  ],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(20),
              ),
              child: Padding(
                padding: EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Mentor Name
                    Text(
                      story.mentorName,
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 18,
                        color: Colors.teal.shade800,
                      ),
                    ),
                    SizedBox(height: 8),

                    // Story Text
                    Text(
                      story.text,
                      style: TextStyle(fontSize: 14, color: Colors.grey.shade800),
                    ),
                    SizedBox(height: 12),

                    // Tags
                    Wrap(
                      spacing: 8,
                      children: story.tags.asMap().entries.map((entry) {
                        int idx = entry.key;
                        String tag = entry.value;
                        Color bgColor = tagColors[idx % tagColors.length];
                        return Chip(
                          label: Text(
                            tag,
                            style: TextStyle(
                                fontSize: 12, fontWeight: FontWeight.bold),
                          ),
                          backgroundColor: bgColor,
                        );
                      }).toList(),
                    ),
                    SizedBox(height: 12),

                    // Location & Posted Time
                    Text(
                      "Posted at ${story.location} · ${story.postedTime.toLocal().toString().substring(0, 10)}",
                      style: TextStyle(fontSize: 12, color: Colors.grey.shade600),
                    ),
                  ],
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}
