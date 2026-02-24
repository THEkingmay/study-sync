import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// 1. นำเข้า useNavigation
import { useNavigation } from '@react-navigation/native';

export function QuickAddModal({ isOpen, onClose }) {
    // 2. เรียกใช้งาน navigation hook
    const navigation = useNavigation();

    const handleNavigate = (tabName) => {
        onClose(); // ปิด Modal ก่อน
        // 3. ส่ง params ชื่อ 'initialTab' ไปยังหน้า Planner
        navigation.navigate('planner', { initialTab: tabName });
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isOpen}
            onRequestClose={onClose}
            statusBarTranslucent={true}     
            navigationBarTranslucent={true} 
        >
            <Pressable style={styles.modalOverlay} onPress={onClose}>
                <View style={styles.modalContent}>
                    {/* ... ส่วนหัวคงเดิม ... */}
                    
                    <View style={styles.buttonGrid}>
                        {/* 4. ใส่ onPress เพื่อเรียกฟังก์ชัน navigate */}
                        <TouchableOpacity 
                            style={styles.menuButton}
                            onPress={() => handleNavigate('activities')}
                        >
                            <View style={[styles.iconContainer, { backgroundColor: '#E8EAF6' }]}>
                                <Ionicons name="book" size={24} color="#3F51B5" />
                            </View>
                            <Text style={styles.menuText}>กิจกรรม</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={styles.menuButton}
                            onPress={() => handleNavigate('study')}
                        >
                            <View style={[styles.iconContainer, { backgroundColor: '#FFF3E0' }]}>
                                <Ionicons name="document-text" size={24} color="#FB8C00" />
                            </View>
                            <Text style={styles.menuText}>แผนอ่านหนังสือ</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Pressable>
        </Modal>
    );
}
// ... styles คงเดิม ...

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        minHeight: 300,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1a1a1a',
    },
    buttonGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    menuButton: {
        width: '48%',
        backgroundColor: '#f8f9fa',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    menuText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#444',
    },
});