// =====================================================
// 📦 IMPORTS
// =====================================================
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute, useNavigation } from "@react-navigation/native";

// 🔹 Components
import PlannerItem from "../components/PlannerItem.jsx";
import PlannerFormModal from "../components/PlannerFormModal";
import Navbar from "../components/Navbar.jsx";

// =====================================================
// 📊 CONSTANTS
// =====================================================
export const TABS = [
  { key: "activities", label: "กิจกรรม", color: "#6366f1", icon: "🎨" },
  { key: "study", label: "แผนการอ่านหนังสือ", color: "#a855f7", icon: "📚" },
];

export const INITIAL_FORM = {
  title: "",
  subject: "",
  description: "",
  category: "",
  otherDetail: "",
  date: new Date(),
};

// =====================================================
// 🧠 MAIN COMPONENT
// =====================================================
export default function Planner() {
  const route = useRoute();
  const navigation = useNavigation();

  // ===============================
  // 📌 STATE
  // ===============================
  const [activeTab, setActiveTab] = useState("activities");
  const [data, setData] = useState({
    activities: [],
    study: [],
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);
  const [editingId, setEditingId] = useState(null);

  // ===============================
  // 🔄 EFFECTS
  // ===============================
  
  // จัดการการนำทางจาก Quick Add
  useEffect(() => {
    if (route.params?.initialTab) {
      const targetTab = route.params.initialTab;
      
      // 1. เปลี่ยน Tab และรีเซ็ตฟอร์ม
      setActiveTab(targetTab);
      setForm(INITIAL_FORM);
      setEditingId(null);

      // 2. ใช้ Timeout เพื่อรอให้ Transition ของหน้าจอเสร็จก่อนค่อยเปิด Modal
      const timer = setTimeout(() => {
        setModalVisible(true);
        // 3. เคลียร์ Params เพื่อป้องกันบั๊ก Modal เด้งซ้ำเมื่อกลับมาหน้านี้
        navigation.setParams({ initialTab: undefined });
      }, 150);

      return () => clearTimeout(timer);
    }
  }, [route.params?.initialTab]);

  // ===============================
  // 📌 DERIVED VALUES
  // ===============================
  const currentTab = TABS.find((tab) => tab.key === activeTab);

  // =====================================================
  // 💾 HANDLERS
  // =====================================================

  const resetFormState = () => {
    setForm(INITIAL_FORM);
    setEditingId(null);
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

    const isEditing = Boolean(editingId);

    if (isEditing) {
      setData((prev) => ({
        ...prev,
        [activeTab]: prev[activeTab].map((item) =>
          item.id === editingId ? { ...item, ...entryData } : item
        ),
      }));
    } else {
      const newItem = {
        id: Date.now().toString(),
        ...entryData,
        completed: false,
      };

      setData((prev) => ({
        ...prev,
        [activeTab]: [newItem, ...prev[activeTab]],
      }));
    }

    setModalVisible(false);
    resetFormState();

    Alert.alert(
      "สำเร็จ 🎉",
      isEditing ? "แก้ไขข้อมูลเรียบร้อยแล้ว" : "บันทึกข้อมูลเรียบร้อยแล้ว"
    );
  };

  const handleToggleComplete = (id) => {
    setData((prev) => ({
      ...prev,
      [activeTab]: prev[activeTab].map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      ),
    }));
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setForm({
      ...item,
      category: item.originalCategory || item.category,
      date: new Date(item.date),
    });
    setModalVisible(true);
  };

  const handleDelete = (id) => {
    Alert.alert("ลบรายการ", "ยืนยันการลบ?", [
      { text: "ยกเลิก" },
      {
        text: "ลบ",
        onPress: () =>
          setData((prev) => ({
            ...prev,
            [activeTab]: prev[activeTab].filter((item) => item.id !== id),
          })),
      },
    ]);
  };

  const handleAddNew = () => {
    resetFormState();
    setModalVisible(true);
  };

  // 🚀 Optimize การ Render List ด้วย useCallback
  const renderPlannerItem = useCallback(({ item }) => (
    <PlannerItem
      item={item}
      activeTab={activeTab}
      onToggle={handleToggleComplete}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  ), [activeTab, data]);

  // =====================================================
  // 🎨 RENDER
  // =====================================================
  return (
    <SafeAreaView style={styles.container}>
      <Navbar />

      <View style={styles.content}>
        <View style={styles.headerSection}>
          <Text style={styles.header}>My Planner</Text>
        </View>

        <View style={styles.tabContainer}>
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tabButton,
                activeTab === tab.key && styles.activeTab,
              ]}
              onPress={() => {
                setActiveTab(tab.key);
                resetFormState();
              }}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab.key && { color: tab.color },
                ]}
              >
                {tab.icon} {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.mainAddBtn, { backgroundColor: currentTab.color }]}
          onPress={handleAddNew}
        >
          <Text style={styles.mainAddBtnText}>
            + เพิ่ม{currentTab.label}ใหม่
          </Text>
        </TouchableOpacity>

        <FlatList
          data={data[activeTab]}
          keyExtractor={(item) => item.id}
          renderItem={renderPlannerItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
          // Performance Props
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={5}
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

// =====================================================
// 🎨 STYLES
// =====================================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  headerSection: {
    marginTop: 20,
    marginBottom: 20,
  },
  header: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1e293b",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#E2E8F0",
    borderRadius: 16,
    padding: 4,
    marginBottom: 15,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 12,
  },
  activeTab: {
    backgroundColor: "#fff",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabText: {
    color: "#64748b",
    fontWeight: "700",
  },
  mainAddBtn: {
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 20,
  },
  mainAddBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },
});