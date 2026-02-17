import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Navbar from '../components/Navbar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function DashboardScreen() {
    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.safeArea}>
            <Navbar />
            <ScrollView style={styles.container}>
                
                <View style={styles.card}>
                    <View style={[styles.cardHeader, { backgroundColor: '#f5f6ff' }]}>
                        <Feather name="clock" size={18} color="#5e6ad2" />
                        <Text style={[styles.headerText, { color: '#5e6ad2' }]}>คาบเรียนถัดไป</Text>
                    </View>
                    <View style={styles.cardBody}>
                        <Feather name="book-open" size={48} color="#ccc" style={{ marginBottom: 12 }} />
                        <Text style={styles.emptyText}>ไม่มีคาบเรียนถัดไป</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('timetable')}>
                            <Text style={styles.actionText}>เพิ่มตารางเรียน</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.card}>
                    <View style={[styles.cardHeader, { backgroundColor: '#fff5f0' }]}>
                        <Ionicons name="alert-circle-outline" size={20} color="#c67c52" />
                        <Text style={[styles.headerText, { color: '#c67c52' }]}>สอบที่ใกล้จะถึง (7 วันข้างหน้า)</Text>
                    </View>
                    <View style={styles.cardBody}>
                        <Ionicons name="alert-circle-outline" size={48} color="#ccc" style={{ marginBottom: 12 }} />
                        <Text style={styles.emptyText}>ไม่มีการสอบในช่วง 7 วันข้างหน้า</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('timetable')}>
                            <Text style={styles.actionText}>เพิ่มตารางสอบ</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFF0F5',
    },
    container: {
        flex: 1,
        padding: 16,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#efefef',
        marginBottom: 16,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 16,
    },
    headerText: {
        fontSize: 15,
        fontWeight: '600',
        marginLeft: 8,
    },
    cardBody: {
        paddingVertical: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        fontSize: 14,
        color: '#777',
        marginBottom: 8,
    },
    actionText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#000',
        marginTop: 4,
    },
});