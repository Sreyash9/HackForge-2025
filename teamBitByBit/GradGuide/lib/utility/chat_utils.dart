String getChatId(String user1, String user2) {
  List<String> ids = [user1, user2];
  ids.sort(); // so studentUID_mentorUID == mentorUID_studentUID
  return ids.join("_");
}
