import 'package:flutter/material.dart';
import 'dart:io';
import 'package:firebase_auth/firebase_auth.dart';
import 'mentordashboard.dart';
import 'package:image_picker/image_picker.dart';
import 'loginpagementor.dart';
import 'services/firebase_auth_service.dart';

class MentorSignupScreen extends StatefulWidget {
  const MentorSignupScreen({Key? key}) : super(key: key);
  @override
  MentorSignupScreenState createState() => MentorSignupScreenState();
}

class MentorSignupScreenState extends State<MentorSignupScreen> {
  final _formKey = GlobalKey<FormState>();
  final _authService = FirebaseAuthService();

  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  final TextEditingController _locationController = TextEditingController();
  final TextEditingController _bioController = TextEditingController();
  final TextEditingController _skillsController = TextEditingController();
  final TextEditingController _graduationYearController =
      TextEditingController();
  final TextEditingController _linkedinController = TextEditingController();
  final TextEditingController _currentJobController = TextEditingController();
  final TextEditingController _availabilityController = TextEditingController();

  bool _isLoading = false;
  File? profileImage;
  final String role = 'mentor'; // fixed role for mentors

  final ImagePicker _picker = ImagePicker();

  Future<void> pickProfileImage() async {
    final pickedFile = await _picker.pickImage(source: ImageSource.gallery);
    if (pickedFile != null) {
      setState(() {
        profileImage = File(pickedFile.path);
      });
    }
  }

  // Signup method
  Future<void> _signUp() async {
    if (_formKey.currentState!.validate()) {
      setState(() {
        _isLoading = true;
      });

      try {
        // Parse skills from comma-separated string
        List<String> skillsList = _skillsController.text
            .split(',')
            .map((e) => e.trim())
            .where((e) => e.isNotEmpty)
            .toList();

        // Add current job to interests if provided, but keep graduation year separate
        List<String> interests = [
          ...skillsList,
          if (_currentJobController.text.isNotEmpty) _currentJobController.text,
        ];

        // Sign up with Firebase
        UserCredential? userCredential = await _authService
            .signUpWithEmailAndPassword(
              email: _emailController.text.trim(),
              password: _passwordController.text.trim(),
              name: _nameController.text.trim(),
              location: _locationController.text.trim(),
              interests: interests,
              userType: role,
              graduationYear: _graduationYearController.text.trim().isNotEmpty
                  ? _graduationYearController.text.trim()
                  : null,
              bio: _bioController.text.trim(),
            );

        if (userCredential != null) {
          // Show success message
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Account created successfully!'),
              backgroundColor: Colors.green,
            ),
          );

          // Navigate to dashboard
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(builder: (context) => MentorDashboard()),
          );
        }
      } catch (e) {
        // Show error message
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.toString()), backgroundColor: Colors.red),
        );
      } finally {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    _locationController.dispose();
    _bioController.dispose();
    _skillsController.dispose();
    _graduationYearController.dispose();
    _linkedinController.dispose();
    _currentJobController.dispose();
    _availabilityController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Mentor Signup'), centerTitle: true),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: ListView(
            children: [
              // Profile Picture
              Center(
                child: GestureDetector(
                  onTap: pickProfileImage,
                  child: CircleAvatar(
                    radius: 50,
                    backgroundImage: profileImage != null
                        ? FileImage(profileImage!)
                        : null,
                    child: profileImage == null
                        ? const Icon(Icons.add_a_photo, size: 40)
                        : null,
                  ),
                ),
              ),
              const SizedBox(height: 16),

              // Name
              TextFormField(
                controller: _nameController,
                decoration: const InputDecoration(
                  labelText: 'Full Name',
                  prefixIcon: Icon(Icons.person),
                ),
                validator: (value) => value == null || value.isEmpty
                    ? 'Please enter your name'
                    : null,
              ),
              const SizedBox(height: 16),

              // Email
              TextFormField(
                controller: _emailController,
                decoration: const InputDecoration(
                  labelText: 'Email',
                  prefixIcon: Icon(Icons.email),
                ),
                keyboardType: TextInputType.emailAddress,
                validator: (value) => value == null || !value.contains('@')
                    ? 'Enter a valid email'
                    : null,
              ),
              const SizedBox(height: 16),

              // Password
              TextFormField(
                controller: _passwordController,
                decoration: const InputDecoration(
                  labelText: 'Password',
                  prefixIcon: Icon(Icons.lock),
                ),
                obscureText: true,
                validator: (value) => value == null || value.length < 6
                    ? 'Password must be at least 6 characters'
                    : null,
              ),
              const SizedBox(height: 16),

              // Role (fixed)
              TextFormField(
                decoration: const InputDecoration(
                  labelText: 'Role',
                  prefixIcon: Icon(Icons.work),
                ),
                initialValue: 'Mentor',
                enabled: false,
              ),
              const SizedBox(height: 16),

              // Location
              TextFormField(
                controller: _locationController,
                decoration: const InputDecoration(
                  labelText: 'Location',
                  prefixIcon: Icon(Icons.location_on),
                ),
                validator: (value) => value == null || value.isEmpty
                    ? 'Please enter your location'
                    : null,
              ),
              const SizedBox(height: 16),

              // Bio
              TextFormField(
                controller: _bioController,
                decoration: const InputDecoration(
                  labelText: 'Short Bio',
                  prefixIcon: Icon(Icons.info),
                ),
                maxLines: 3,
                validator: (value) => value == null || value.isEmpty
                    ? 'Please enter a short bio'
                    : null,
              ),
              const SizedBox(height: 16),

              // Skills / Tags
              TextFormField(
                controller: _skillsController,
                decoration: const InputDecoration(
                  labelText: 'Skills / Expertise (comma-separated)',
                  prefixIcon: Icon(Icons.star),
                  hintText: 'e.g., Python, Leadership, Project Management',
                ),
                validator: (value) => value == null || value.isEmpty
                    ? 'Enter at least one skill'
                    : null,
              ),
              const SizedBox(height: 16),

              // Graduation Year
              TextFormField(
                controller: _graduationYearController,
                decoration: const InputDecoration(
                  labelText: 'Graduation Year',
                  prefixIcon: Icon(Icons.school),
                ),
                keyboardType: TextInputType.number,
                validator: (value) => value == null || value.isEmpty
                    ? 'Enter your graduation year'
                    : null,
              ),
              const SizedBox(height: 16),

              // LinkedIn / Portfolio
              TextFormField(
                controller: _linkedinController,
                decoration: const InputDecoration(
                  labelText: 'LinkedIn / Portfolio (optional)',
                  prefixIcon: Icon(Icons.link),
                ),
              ),
              const SizedBox(height: 16),

              // Current Job / Company
              TextFormField(
                controller: _currentJobController,
                decoration: const InputDecoration(
                  labelText: 'Current Job / Company (optional)',
                  prefixIcon: Icon(Icons.business),
                ),
              ),
              const SizedBox(height: 16),

              // Availability / Hours
              TextFormField(
                controller: _availabilityController,
                decoration: const InputDecoration(
                  labelText: 'Availability / Hours (optional)',
                  prefixIcon: Icon(Icons.schedule),
                ),
              ),
              const SizedBox(height: 32),

              // Sign Up Button
              SizedBox(
                height: 50,
                child: ElevatedButton(
                  onPressed: _isLoading ? null : _signUp,
                  style: ElevatedButton.styleFrom(
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(10),
                    ),
                  ),
                  child: _isLoading
                      ? const CircularProgressIndicator(
                          valueColor: AlwaysStoppedAnimation<Color>(
                            Colors.white,
                          ),
                        )
                      : const Text('Sign Up', style: TextStyle(fontSize: 18)),
                ),
              ),
              const SizedBox(height: 16),

              // Login Link
              TextButton(
                onPressed: () {
                  Navigator.pushReplacement(
                    context,
                    MaterialPageRoute(builder: (_) => const LoginPageMentor()),
                  );
                },
                child: const Text('Already have an account? Login'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
