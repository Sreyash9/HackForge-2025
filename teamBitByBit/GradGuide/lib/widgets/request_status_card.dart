import 'package:flutter/material.dart';
import '../models/mentor_request.dart';

class RequestStatusCard extends StatelessWidget {
  final MentorRequest request;
  final Color color;
  final IconData icon;
  final Color iconColor;

  const RequestStatusCard({
    super.key,
    required this.request,
    required this.color,
    required this.icon,
    required this.iconColor,
  });

  String _formatTime(DateTime dateTime) {
    final now = DateTime.now();
    final difference = now.difference(dateTime);

    if (difference.inMinutes < 1) {
      return 'Just now';
    } else if (difference.inHours < 1) {
      return '${difference.inMinutes}m ago';
    } else if (difference.inDays < 1) {
      return '${difference.inHours}h ago';
    } else {
      return '${difference.inDays}d ago';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: color,
          borderRadius: BorderRadius.circular(8),
        ),
        child: Row(
          children: [
            Icon(icon, color: iconColor, size: 20),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    request.mentorName,
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 14,
                    ),
                  ),
                  Text(
                    '${request.status.toUpperCase()} • ${_formatTime(request.createdAt)}',
                    style: TextStyle(fontSize: 12, color: Colors.grey.shade700),
                  ),
                  if (request.status == 'rejected')
                    const Text(
                      'Request was declined',
                      style: TextStyle(
                        fontSize: 12,
                        fontStyle: FontStyle.italic,
                      ),
                    ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
