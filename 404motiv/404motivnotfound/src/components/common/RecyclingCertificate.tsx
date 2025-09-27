import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    padding: 40,
  },
  header: {
    marginBottom: 20,
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    color: '#22c55e', // green-500
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    color: '#4b5563', // gray-600
  },
  content: {
    margin: 20,
    padding: 20,
    border: '2px solid #22c55e',
    borderRadius: 8,
  },
  text: {
    fontSize: 12,
    marginBottom: 10,
    color: '#1f2937', // gray-800
    textAlign: 'center',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 20,
    color: '#22c55e',
    textAlign: 'center',
  },
  achievementList: {
    marginVertical: 15,
  },
  achievement: {
    fontSize: 12,
    marginBottom: 8,
    textAlign: 'center',
    color: '#4b5563',
  },
  date: {
    fontSize: 12,
    marginTop: 30,
    color: '#6b7280',
    textAlign: 'center',
  },
  signature: {
    marginTop: 40,
    textAlign: 'center',
    borderTop: '1px solid #e5e7eb',
    paddingTop: 10,
  },
});

interface CertificateProps {
  userName: string;
  completionDate: string;
}

export const RecyclingCertificate: React.FC<CertificateProps> = ({ userName, completionDate }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Certificate of Achievement</Text>
        <Text style={styles.subtitle}>Recycling Process Guide</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.text}>
          This certifies that
        </Text>
        <Text style={styles.userName}>
          {userName}
        </Text>
        <Text style={styles.text}>
          has successfully completed the comprehensive recycling process guide,
          demonstrating commitment to environmental sustainability and mastery of:
        </Text>
        
        <View style={styles.achievementList}>
          <Text style={styles.achievement}>• Product QR Code Scanning and Identification</Text>
          <Text style={styles.achievement}>• Understanding Material-Specific Recycling Guidelines</Text>
          <Text style={styles.achievement}>• Proper Item Preparation Techniques</Text>
          <Text style={styles.achievement}>• Correct Waste Sorting and Disposal Methods</Text>
        </View>

        <Text style={styles.text}>
          This achievement represents a significant step towards creating a more sustainable future
          through proper recycling practices.
        </Text>

        <Text style={styles.date}>
          Awarded on: {completionDate}
        </Text>

        <View style={styles.signature}>
          <Text style={[styles.text, { fontStyle: 'italic' }]}>
            Smart Waste Recycling Platform
          </Text>
          <Text style={[styles.text, { fontSize: 10, color: '#6b7280' }]}>
            Certified by the Environmental Education Initiative
          </Text>
        </View>
      </View>
    </Page>
  </Document>
);