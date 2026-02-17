import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export function QuickAddModal({ isOpen, onClose }) {
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
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Quick Add</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color="#333" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.buttonGrid}>
                        <TouchableOpacity style={styles.menuButton}>
                            <View style={[styles.iconContainer, { backgroundColor: '#E8EAF6' }]}>
                                <Ionicons name="book" size={24} color="#3F51B5" />
                            </View>
                            <Text style={styles.menuText}>กิจกรรม</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.menuButton}>
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