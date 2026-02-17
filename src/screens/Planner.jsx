import React, { useState } from "react";
import {
    View, Text, TouchableOpacity, StyleSheet, FlatList,
    StatusBar, Alert
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import PlannerItem from "../components/PlannerItem.jsx";
import PlannerFormModal from "../components/PlannerFormModal";
import Navbar from "../components/Navbar.jsx";


export const TABS = [
    { key: "activities", label: "กิจกรรม", color: "#6366f1", icon: "🎨" },
    { key: "study", label: "การเรียน", color: "#a855f7", icon: "📚" },
];

export const ACTIVITY_TYPES = ["ชมรม", "กีฬา", "อาสาสมัคร", "อื่นๆ"];

export const STUDY_PRIORITY = [
    { label: "ไม่เร่งด่วน", color: "#10b981" },
    { label: "ปานกลาง", color: "#f59e0b" },
    { label: "สำคัญมาก", color: "#ef4444" },
];

export const INITIAL_FORM = {
    title: "",
    subject: "",
    description: "",
    category: "",
    otherDetail: "",
    date: new Date(),
};

export default function Planner() {
    const [activeTab, setActiveTab] = useState("activities");
    const [data, setData] = useState({ activities: [], study: [] });
    const [modalVisible, setModalVisible] = useState(false);
    const [form, setForm] = useState(INITIAL_FORM);
    const [editingId, setEditingId] = useState(null);

    const currentTab = TABS.find((tab) => tab.key === activeTab);

    const handleSave = () => {
        if (!form.title.trim()) {
            Alert.alert("แจ้งเตือน", "กรุณาระบุหัวข้อรายการ");
            return;
        }
        if (activeTab === "study" && !form.subject.trim()) {
            Alert.alert("แจ้งเตือน", "กรุณาระบุชื่อวิชา");
            return;
        }
        if (!form.category) {
            Alert.alert("แจ้งเตือน", "กรุณาเลือกหมวดหมู่/ความสำคัญ");
            return;
        }

        const finalCategory = form.category === "อื่นๆ" ? form.otherDetail : form.category;
        const entryData = {
            ...form,
            category: finalCategory,
            originalCategory: form.category,
        };

        if (editingId) {
            setData(prev => ({
                ...prev,
                [activeTab]: prev[activeTab].map(item => item.id === editingId ? { ...item, ...entryData } : item)
            }));
        } else {
            const newItem = { id: Date.now().toString(), ...entryData, completed: false };
            setData(prev => ({ ...prev, [activeTab]: [newItem, ...prev[activeTab]] }));
        }

        setModalVisible(false);
        setForm(INITIAL_FORM);
        setEditingId(null);
    };

    const handleToggleComplete = (id) => {
        setData(prev => ({
            ...prev,
            [activeTab]: prev[activeTab].map(i => i.id === id ? { ...i, completed: !i.completed } : i)
        }));
    };

    const handleEdit = (item) => {
        setEditingId(item.id);
        setForm({ ...item, category: item.originalCategory || item.category, date: new Date(item.date) });
        setModalVisible(true);
    };

    const handleDelete = (id) => {
        Alert.alert("ลบรายการ", "ยืนยันการลบ?", [
            { text: "ยกเลิก" },
            { text: "ลบ", onPress: () => setData(prev => ({ ...prev, [activeTab]: prev[activeTab].filter(i => i.id !== id) })) }
        ]);
    };

    return (
        <SafeAreaView style={styles.container}>
            <Navbar />
            <View style={{paddingHorizontal : 20}}>
                <View style={styles.headerSection}>
                    <Text style={styles.welcomeText}>รายการของคุณ 📋</Text>
                    <Text style={styles.header}>My Planner</Text>
                </View>

                <View style={styles.tabContainer}>
                    {TABS.map((tab) => (
                        <TouchableOpacity
                            key={tab.key}
                            style={[styles.tabButton, activeTab === tab.key && styles.activeTab]}
                            onPress={() => { setActiveTab(tab.key); setForm(INITIAL_FORM); }}
                        >
                            <Text style={[styles.tabText, activeTab === tab.key && { color: tab.color }]}>
                                {tab.icon} {tab.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <TouchableOpacity
                    style={[styles.mainAddBtn, { backgroundColor: currentTab.color }]}
                    onPress={() => { setEditingId(null); setForm(INITIAL_FORM); setModalVisible(true); }}
                >
                    <Text style={styles.mainAddBtnText}>+ เพิ่ม{currentTab.label}ใหม่</Text>
                </TouchableOpacity>

                <FlatList
                    data={data[activeTab]}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <PlannerItem
                            item={item}
                            activeTab={activeTab}
                            onToggle={handleToggleComplete}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    )}
                />

            </View>
            <PlannerFormModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                activeTab={activeTab}
                form={form}
                setForm={setForm}
                onSave={handleSave}
                editingId={editingId}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F8FAFC" },
    headerSection: { marginTop: 20, marginBottom: 20 },
    welcomeText: { fontSize: 13, color: '#64748b', fontWeight: '700' },
    header: { fontSize: 32, fontWeight: "800", color: "#1e293b" },
    tabContainer: { flexDirection: "row", backgroundColor: "#E2E8F0", borderRadius: 16, padding: 4, marginBottom: 15 },
    tabButton: { flex: 1, paddingVertical: 12, alignItems: "center", borderRadius: 12 },
    activeTab: { backgroundColor: "#fff", elevation: 3 },
    tabText: { color: "#64748b", fontWeight: "700" },
    mainAddBtn: { padding: 16, borderRadius: 16, alignItems: "center", marginBottom: 20 },
    mainAddBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});