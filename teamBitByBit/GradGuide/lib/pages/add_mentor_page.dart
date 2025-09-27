import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import '../services/mentor_request_service.dart';
import '../services/firebase_auth_service.dart';
import '../models/user_model.dart';

class AddMentorPage extends StatefulWidget {
  const AddMentorPage({super.key});

  @override
  State<AddMentorPage> createState() => _AddMentorPageState();
}

class _AddMentorPageState extends State<AddMentorPage> {
  final _mentorRequestService = MentorRequestService();
  final _authService = FirebaseAuthService();

  bool _isOnlineMode = true;
  bool _isLoading = true;
  List<UserModel> _matchingMentors = [];
  UserModel? _currentUser;
  Set<String> _requestedMentors = {};

  @override
  void initState() {
    super.initState();
    _loadCurrentUser();
  }

  Future<void> _loadCurrentUser() async {
    try {
      final currentUser = FirebaseAuth.instance.currentUser;
      if (currentUser != null) {
        _currentUser = await _authService.getUserDocument(currentUser.uid);
        if (_currentUser != null) {
          await _loadMatchingMentors();
        }
      }
    } catch (e) {
      _showErrorSnackBar('Error loading user data: ${e.toString()}');
    }
  }

  Future<void> _loadMatchingMentors() async {
    if (_currentUser == null) return;

    setState(() {
      _isLoading = true;
    });

    try {
      final mentors = await _mentorRequestService.getMatchingMentors(
        studentInterests: _currentUser!.interests,
        studentLocation: _currentUser!.location,
        onlineMode: _isOnlineMode,
      );

      // Remove current user from the list
      mentors.removeWhere((mentor) => mentor.uid == _currentUser!.uid);

      setState(() {
        _matchingMentors = mentors;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _isLoading = false;
      });
      _showErrorSnackBar('Error loading mentors: ${e.toString()}');
    }
  }

  Future<void> _sendMentorRequest(UserModel mentor) async {
    // Check if request already exists
    final hasExisting = await _mentorRequestService.hasExistingRequest(
      _currentUser!.uid,
      mentor.uid,
    );

    if (hasExisting) {
      _showErrorSnackBar('You have already sent a request to this mentor');
      return;
    }

    try {
      await _mentorRequestService.sendMentorRequest(
        mentorId: mentor.uid,
        mentorName: mentor.name,
        message: 'Hi ${mentor.name}, I would like you to be my mentor!',
      );

      setState(() {
        _requestedMentors.add(mentor.uid);
      });

      _showSuccessSnackBar('Request sent to ${mentor.name}!');
    } catch (e) {
      _showErrorSnackBar('Error sending request: ${e.toString()}');
    }
  }

  void _showErrorSnackBar(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(message), backgroundColor: Colors.red),
    );
  }

  void _showSuccessSnackBar(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(message), backgroundColor: Colors.green),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Find Mentors'),
        backgroundColor: Colors.teal.shade600,
        elevation: 0,
      ),
      body: Column(
        children: [
          // Mode Selection
          Container(
            padding: const EdgeInsets.all(16),
            color: Colors.teal.shade50,
            child: Row(
              children: [
                const Text(
                  'Mode: ',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                ),
                const SizedBox(width: 10),
                ChoiceChip(
                  label: const Text('Online'),
                  selected: _isOnlineMode,
                  onSelected: (selected) {
                    if (selected) {
                      setState(() {
                        _isOnlineMode = true;
                      });
                      _loadMatchingMentors();
                    }
                  },
                  selectedColor: Colors.teal.shade200,
                ),
                const SizedBox(width: 10),
                ChoiceChip(
                  label: const Text('Offline'),
                  selected: !_isOnlineMode,
                  onSelected: (selected) {
                    if (selected) {
                      setState(() {
                        _isOnlineMode = false;
                      });
                      _loadMatchingMentors();
                    }
                  },
                  selectedColor: Colors.orange.shade200,
                ),
              ],
            ),
          ),

          // Mentors List
          Expanded(
            child: _isLoading
                ? const Center(child: CircularProgressIndicator())
                : _matchingMentors.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          Icons.person_search,
                          size: 64,
                          color: Colors.grey.shade400,
                        ),
                        const SizedBox(height: 16),
                        Text(
                          _isOnlineMode
                              ? 'No mentors found with matching interests'
                              : 'No mentors found in your area with matching interests',
                          style: TextStyle(
                            fontSize: 16,
                            color: Colors.grey.shade600,
                          ),
                          textAlign: TextAlign.center,
                        ),
                        const SizedBox(height: 16),
                        ElevatedButton(
                          onPressed: () {
                            setState(() {
                              _isOnlineMode = true;
                            });
                            _loadMatchingMentors();
                          },
                          child: const Text('Try Online Mode'),
                        ),
                      ],
                    ),
                  )
                : ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: _matchingMentors.length,
                    itemBuilder: (context, index) {
                      final mentor = _matchingMentors[index];
                      final isRequested = _requestedMentors.contains(
                        mentor.uid,
                      );

                      // Calculate common interests
                      final commonInterests = mentor.interests
                          .where(
                            (skill) => _currentUser!.interests.contains(skill),
                          )
                          .toList();

                      return Card(
                        margin: const EdgeInsets.only(bottom: 16),
                        elevation: 3,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Padding(
                          padding: const EdgeInsets.all(16),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  CircleAvatar(
                                    radius: 25,
                                    backgroundColor: Colors.teal.shade100,
                                    child: Text(
                                      mentor.name[0].toUpperCase(),
                                      style: TextStyle(
                                        fontSize: 20,
                                        fontWeight: FontWeight.bold,
                                        color: Colors.teal.shade800,
                                      ),
                                    ),
                                  ),
                                  const SizedBox(width: 12),
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          mentor.name,
                                          style: const TextStyle(
                                            fontSize: 18,
                                            fontWeight: FontWeight.bold,
                                          ),
                                        ),
                                        Text(
                                          mentor.location,
                                          style: TextStyle(
                                            fontSize: 14,
                                            color: Colors.grey.shade600,
                                          ),
                                        ),
                                        if (mentor.graduationYear != null)
                                          Text(
                                            'Graduated: ${mentor.graduationYear}',
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

                              if (mentor.bio != null) ...[
                                const SizedBox(height: 12),
                                Text(
                                  mentor.bio!,
                                  style: TextStyle(
                                    fontSize: 14,
                                    color: Colors.grey.shade700,
                                  ),
                                ),
                              ],

                              const SizedBox(height: 12),

                              // Common Interests
                              if (commonInterests.isNotEmpty) ...[
                                Text(
                                  'Common Interests:',
                                  style: TextStyle(
                                    fontSize: 14,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.teal.shade800,
                                  ),
                                ),
                                const SizedBox(height: 8),
                                Wrap(
                                  spacing: 8,
                                  runSpacing: 4,
                                  children: commonInterests.map((interest) {
                                    return Chip(
                                      label: Text(
                                        interest,
                                        style: const TextStyle(fontSize: 12),
                                      ),
                                      backgroundColor: Colors.green.shade100,
                                      materialTapTargetSize:
                                          MaterialTapTargetSize.shrinkWrap,
                                    );
                                  }).toList(),
                                ),
                                const SizedBox(height: 12),
                              ],

                              // All Skills
                              Text(
                                'Skills:',
                                style: TextStyle(
                                  fontSize: 14,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.grey.shade800,
                                ),
                              ),
                              const SizedBox(height: 8),
                              Wrap(
                                spacing: 8,
                                runSpacing: 4,
                                children: mentor.interests.map((skill) {
                                  final isCommon = commonInterests.contains(
                                    skill,
                                  );
                                  return Chip(
                                    label: Text(
                                      skill,
                                      style: const TextStyle(fontSize: 12),
                                    ),
                                    backgroundColor: isCommon
                                        ? Colors.green.shade100
                                        : Colors.grey.shade200,
                                    materialTapTargetSize:
                                        MaterialTapTargetSize.shrinkWrap,
                                  );
                                }).toList(),
                              ),

                              const SizedBox(height: 16),

                              // Request Button
                              SizedBox(
                                width: double.infinity,
                                child: ElevatedButton(
                                  onPressed: isRequested
                                      ? null
                                      : () => _sendMentorRequest(mentor),
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: isRequested
                                        ? Colors.grey.shade400
                                        : Colors.teal.shade600,
                                    padding: const EdgeInsets.symmetric(
                                      vertical: 12,
                                    ),
                                    shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(8),
                                    ),
                                  ),
                                  child: Text(
                                    isRequested
                                        ? 'Request Sent'
                                        : 'Send Mentor Request',
                                    style: const TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ),
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
  }
}
