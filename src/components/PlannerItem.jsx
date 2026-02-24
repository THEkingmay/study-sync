import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
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

export default function PlannerItem({ item, activeTab, onToggle, onEdit, onDelete }) {
    const currentTab = TABS.find((tab) => tab.key === activeTab);

    const getCategoryColor = (categoryName) => {
        if (activeTab === "activities") return currentTab.color;
        const priority = STUDY_PRIORITY.find((p) => p.label === categoryName);
        return priority ? priority.color : currentTab.color;
    };

    // const formatDateTime = (date) => {
    //     return new Date(date).toLocaleString("th-TH", {
    //         day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
    //     });
    // };

    const itemColor = getCategoryColor(item.category);

    return (
        <View style={[styles.card, item.completed && styles.completedCard]}>
            <TouchableOpacity style={styles.checkCircle} onPress={() => onToggle(item.id)}>
                <View style={[styles.circle, { borderColor: itemColor }, item.completed && { backgroundColor: itemColor }]}>
                    {item.completed && <Text style={styles.checkMark}>✓</Text>}
                </View>
            </TouchableOpacity>

            <View style={styles.cardContent}>
                {item.subject ? <Text style={styles.subjectText}>วิชา: {item.subject}</Text> : null}
                <Text style={[styles.cardTitle, item.completed && styles.strikeText]}>{item.title}</Text>
                {item.description ? (
                    <Text style={styles.descriptionDisplay} numberOfLines={2}>{item.description}</Text>
                ) : null}
                <View style={styles.cardFooter}>
                    <View style={[styles.tag, { backgroundColor: itemColor + '20' }]}>
                        <Text style={[styles.categoryText, { color: itemColor }]}>
                            {item.category}
                        </Text>
                    </View>

                    {item.date && (
                        <Text style={styles.cardDate}>
                            📅 {new Date(item.date).toLocaleDateString("th-TH")}
                        </Text>
                    )}

                    {item.startTime && item.endTime && (
                        <Text style={styles.cardDate}>
                            🕒 {item.startTime} - {item.endTime}
                        </Text>
                    )}
                </View>
            </View>

            <View style={styles.actionRow}>
                <TouchableOpacity onPress={() => onEdit(item)} style={styles.actionBtn}>
                    <Text style={styles.editIcon}>✏️</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onDelete(item.id)} style={styles.actionBtn}>
                    <Text style={styles.deleteIcon}>🗑️</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: { backgroundColor: "#fff", borderRadius: 20, padding: 16, marginBottom: 12, flexDirection: "row", alignItems: 'center', elevation: 2 },
    checkCircle: { marginRight: 12 },
    circle: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, justifyContent: 'center', alignItems: 'center' },
    checkMark: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
    cardContent: { flex: 1 },
    subjectText: { fontSize: 12, fontWeight: 'bold', color: '#a855f7', marginBottom: 2 },
    cardTitle: { fontSize: 16, fontWeight: "700", color: "#334155" },
    descriptionDisplay: { fontSize: 13, color: '#64748b', marginTop: 4, lineHeight: 18 },
    cardFooter: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
    tag: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, marginRight: 8 },
    categoryText: { fontSize: 11, fontWeight: "800" },
    cardDate: { fontSize: 11, color: "#94a3b8" },
    strikeText: { textDecorationLine: "line-through", color: '#cbd5e1' },
    completedCard: { opacity: 0.6 },
    actionRow: { flexDirection: 'row', alignItems: 'center' },
    actionBtn: { padding: 8, marginLeft: 4 },
    editIcon: { fontSize: 16 },
    deleteIcon: { fontSize: 18 },
});