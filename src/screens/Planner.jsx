import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  StyleSheet,
  FlatList,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Alert,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

/* =========================
   Constants & Theme
========================= */
const TABS = [
  { key: "activities", label: "กิจกรรม", color: "#6366f1", icon: "🎨" },
  { key: "study", label: "การเรียน", color: "#a855f7", icon: "📚" },
];

const ACTIVITY_TYPES = ["ชมรม", "กีฬา", "อาสาสมัคร", "อื่นๆ"];
const STUDY_PRIORITY = [
  { label: "ไม่เร่งด่วน", color: "#10b981" },
  { label: "ปานกลาง", color: "#f59e0b" },
  { label: "สำคัญมาก", color: "#ef4444" },
];

const INITIAL_FORM = {
  title: "",
  subject: "",
  description: "", // เพิ่มช่องรายละเอียด
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

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

  const currentTab = TABS.find((tab) => tab.key === activeTab);

  const formatDateTime = (date) => {
    return new Date(date).toLocaleString("th-TH", {
      day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
    });
  };

  const getCategoryColor = (categoryName) => {
    if (activeTab === "activities") return currentTab.color;
    const priority = STUDY_PRIORITY.find(p => p.label === categoryName);
    return priority ? priority.color : currentTab.color;
  };

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

  const renderItem = ({ item }) => {
    const itemColor = getCategoryColor(item.category);
    return (
      <View style={[styles.card, item.completed && styles.completedCard]}>
        <TouchableOpacity 
          style={styles.checkCircle} 
          onPress={() => {
            setData(prev => ({
              ...prev,
              [activeTab]: prev[activeTab].map(i => i.id === item.id ? {...i, completed: !i.completed} : i)
            }));
          }}
        >
          <View style={[styles.circle, { borderColor: itemColor }, item.completed && { backgroundColor: itemColor }]}>
            {item.completed && <Text style={styles.checkMark}>✓</Text>}
          </View>
        </TouchableOpacity>

        <View style={styles.cardContent}>
          {item.subject ? <Text style={styles.subjectText}>วิชา: {item.subject}</Text> : null}
          <Text style={[styles.cardTitle, item.completed && styles.strikeText]}>{item.title}</Text>
          
          {/* แสดงรายละเอียดเพิ่มเติม (ถ้ามี) */}
          {item.description ? (
            <Text style={styles.descriptionDisplay} numberOfLines={2}>
              {item.description}
            </Text>
          ) : null}

          <View style={styles.cardFooter}>
            <View style={[styles.tag, { backgroundColor: itemColor + '20' }]}>
               <Text style={[styles.categoryText, { color: itemColor }]}>{item.category}</Text>
            </View>
            <Text style={styles.cardDate}>🕒 {formatDateTime(item.date)}</Text>
          </View>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity onPress={() => {
            setEditingId(item.id);
            setForm({ ...item, category: item.originalCategory || item.category, date: new Date(item.date) });
            setModalVisible(true);
          }} style={styles.actionBtn}>
            <Text style={styles.editIcon}>✏️</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            Alert.alert("ลบรายการ", "ยืนยันการลบ?", [
              {text: "ยกเลิก"},
              {text: "ลบ", onPress: () => setData(prev => ({...prev, [activeTab]: prev[activeTab].filter(i => i.id !== item.id)}))}
            ]);
          }} style={styles.actionBtn}>
            <Text style={styles.deleteIcon}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
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

      <FlatList data={data[activeTab]} keyExtractor={(item) => item.id} renderItem={renderItem} />

      <Modal visible={modalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{editingId ? 'แก้ไขข้อมูล' : `เพิ่ม${currentTab.label}`}</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}><Text style={{fontSize: 24, color: '#94a3b8'}}>✕</Text></TouchableOpacity>
            </View>

            <TextInput
              placeholder="หัวข้อรายการ (เช่น ทำสรุป, ส่งงาน)..."
              style={styles.input}
              value={form.title}
              onChangeText={(t) => setForm((prev) => ({ ...prev, title: t }))}
            />

            {activeTab === "study" && (
              <TextInput
                placeholder="ชื่อวิชา (เช่น คณิตศาสตร์, ภาษาอังกฤษ)..."
                style={[styles.input, { borderLeftWidth: 4, borderLeftColor: currentTab.color }]}
                value={form.subject}
                onChangeText={(t) => setForm((prev) => ({ ...prev, subject: t }))}
              />
            )}

            {/* ช่องกรอกรายละเอียดเพิ่มเติม ทั้งสองหน้า */}
            <TextInput
              placeholder="รายละเอียดเพิ่มเติม (ระบุข้อมูลที่ต้องการบันทึก)..."
              style={[styles.input, styles.textArea]}
              value={form.description}
              onChangeText={(t) => setForm((prev) => ({ ...prev, description: t }))}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />

            <Text style={styles.selectLabel}>{activeTab === "activities" ? "เลือกหมวดหมู่" : "ระดับความสำคัญ"}</Text>
            <View style={styles.optionContainer}>
              {(activeTab === "activities" 
                ? ACTIVITY_TYPES.map(a => ({label: a, color: currentTab.color}))
                : STUDY_PRIORITY
              ).map((opt) => (
                <TouchableOpacity
                  key={opt.label}
                  onPress={() => setForm((prev) => ({ ...prev, category: opt.label }))}
                  style={[styles.optionButton, form.category === opt.label && { backgroundColor: opt.color }]}
                >
                  <Text style={[styles.optionText, form.category === opt.label && { color: "#fff" }]}>{opt.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {form.category === "อื่นๆ" && (
              <TextInput
                placeholder="ระบุรายละเอียดอื่นๆ..."
                style={[styles.input, { borderColor: currentTab.color, borderWidth: 1 }]}
                value={form.otherDetail}
                onChangeText={(t) => setForm((prev) => ({ ...prev, otherDetail: t }))}
              />
            )}

            <TouchableOpacity style={styles.datePickerBtn} onPress={() => setDatePickerVisibility(true)}>
              <View>
                <Text style={styles.datePickerLabel}>กำหนดวันเวลา</Text>
                <Text style={[styles.dateValue, { color: currentTab.color }]}>{formatDateTime(form.date)}</Text>
              </View>
              <Text style={{fontSize: 22}}>📅</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.btnSave, { backgroundColor: currentTab.color }]} onPress={handleSave}>
              <Text style={styles.saveText}>บันทึกรายการ</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <DateTimePickerModal
        isVisible={isDatePickerVisible} mode="date"
        onConfirm={(date) => { setForm(prev => ({...prev, date})); setDatePickerVisibility(false); setTimeout(() => setTimePickerVisibility(true), 600); }}
        onCancel={() => setDatePickerVisibility(false)}
      />
      <DateTimePickerModal
        isVisible={isTimePickerVisible} mode="time"
        onConfirm={(time) => {
          const combined = new Date(form.date);
          combined.setHours(time.getHours(), time.getMinutes());
          setForm(prev => ({...prev, date: combined}));
          setTimePickerVisibility(false);
        }}
        onCancel={() => setTimePickerVisibility(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC", paddingHorizontal: 20 },
  headerSection: { marginTop: 20, marginBottom: 20 },
  welcomeText: { fontSize: 13, color: '#64748b', fontWeight: '700' },
  header: { fontSize: 32, fontWeight: "800", color: "#1e293b" },
  tabContainer: { flexDirection: "row", backgroundColor: "#E2E8F0", borderRadius: 16, padding: 4, marginBottom: 15 },
  tabButton: { flex: 1, paddingVertical: 12, alignItems: "center", borderRadius: 12 },
  activeTab: { backgroundColor: "#fff", elevation: 3 },
  tabText: { color: "#64748b", fontWeight: "700" },
  mainAddBtn: { padding: 16, borderRadius: 16, alignItems: "center", marginBottom: 20 },
  mainAddBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
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
  modalOverlay: { flex: 1, backgroundColor: "rgba(15, 23, 42, 0.6)", justifyContent: "flex-end" },
  modalBox: { width: "100%", backgroundColor: "#fff", borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25, paddingBottom: 40 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: "800", color: '#1e293b' },
  input: { backgroundColor: "#F1F5F9", padding: 16, borderRadius: 12, marginBottom: 12, fontSize: 16 },
  textArea: { height: 80, fontSize: 14 },
  selectLabel: { fontWeight: "700", marginBottom: 10, color: '#475569', fontSize: 14 },
  optionContainer: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 20 },
  optionButton: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 10, backgroundColor: '#F1F5F9' },
  optionText: { color: '#64748b', fontWeight: '700', fontSize: 13 },
  datePickerBtn: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#F1F5F9', borderRadius: 12, marginBottom: 25 },
  datePickerLabel: { fontSize: 12, color: '#64748b', fontWeight: '600' },
  dateValue: { fontWeight: '700', fontSize: 15 },
  btnSave: { padding: 16, borderRadius: 12, alignItems: "center" },
  saveText: { color: "#fff", fontWeight: "800", fontSize: 16 },
});