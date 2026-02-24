import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Modal,
    TextInput,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useData } from "../contexts/DataProvider";

const days = [
    { label: "จันทร์", value: "Monday" },
    { label: "อังคาร", value: "Tuesday" },
    { label: "พุธ", value: "Wednesday" },
    { label: "พฤหัสบดี", value: "Thursday" },
    { label: "ศุกร์", value: "Friday" },
];

const themeColors = [
    "#6C5CE7", "#8E44AD", "#E84393", "#FF7675", "#FD7E14",
    "#F1C40F", "#2ECC71", "#16A085", "#00CEC9",
];

export default function TimetableModal({
    visible,
    onClose,
    activeTab,
    form,
    setForm,
    onSave,
    isEditing,
}) {
    const [studyPicker, setStudyPicker] = useState(null);
    const [examPicker, setExamPicker] = useState(null);

    const { studyData } = useData();

    const displayDecimalTime = (decimalTime) => {
        if (decimalTime === "" || decimalTime === undefined) return "เลือกเวลา";
        const h = Math.floor(decimalTime);
        const m = Math.round((decimalTime - h) * 60);
        return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
    };

    const handleConfirmStudyTime = (date) => {
        const decimalTime = date.getHours() + (date.getMinutes() / 60);
        setForm({ ...form, [studyPicker]: decimalTime });
        setStudyPicker(null);
    };

    const handleConfirmExam = (date) => {
        if (examPicker === "examDate") {
            const d = date.getDate().toString().padStart(2, "0");
            const m = (date.getMonth() + 1).toString().padStart(2, "0");
            const y = date.getFullYear();
            setForm({ ...form, examDate: `${d}/${m}/${y}` });
        } else if (examPicker === "examTime_start") {
            const h = date.getHours().toString().padStart(2, "0");
            const min = date.getMinutes().toString().padStart(2, "0");
            setForm({ ...form, examTime_start: `${h}:${min}` });
        } else if (examPicker === "examTime_end") {
            const h = date.getHours().toString().padStart(2, "0");
            const min = date.getMinutes().toString().padStart(2, "0");
            setForm({ ...form, examTime_end: `${h}:${min}` });
        }
        setExamPicker(null);
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            statusBarTranslucent={true}
            navigationBarTranslucent={true}
        >
            <KeyboardAvoidingView
                style={styles.modalOverlay}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <View style={styles.modalBox}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>
                            {activeTab === "study"
                                ? (isEditing ? "แก้ไขวิชา" : "เพิ่มวิชาใหม่")
                                : (isEditing ? "แก้ไขการสอบ" : "เพิ่มการสอบใหม่")}
                        </Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                            <Text style={styles.closeText}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        {activeTab === "study" && (
                            <>
                                <Text style={styles.label}>รหัสวิชา</Text>
                                <TextInput style={styles.input} placeholder="เช่น CS101" value={form.code} onChangeText={(t) => setForm({ ...form, code: t })} />

                                <Text style={styles.label}>ชื่อวิชา</Text>
                                <TextInput style={styles.input} placeholder="เช่น Computer Programming" value={form.name} onChangeText={(t) => setForm({ ...form, name: t })} />

                                <Text style={styles.label}>ห้องเรียน</Text>
                                <TextInput style={styles.input} placeholder="เช่น E301" value={form.room} onChangeText={(t) => setForm({ ...form, room: t })} />

                                <Text style={styles.label}>วัน</Text>
                                <View style={styles.pickerContainer}>
                                    <Picker selectedValue={form.day} onValueChange={(v) => setForm({ ...form, day: v })}>
                                        {days.map((d) => (
                                            <Picker.Item key={d.value} label={d.label} value={d.value} />
                                        ))}
                                    </Picker>
                                </View>

                                <View style={styles.row}>
                                    <View style={styles.halfInput}>
                                        <Text style={styles.label}>เวลาเริ่ม</Text>
                                        <TouchableOpacity style={styles.inputBox} onPress={() => setStudyPicker("start")}>
                                            <Text style={form.start !== "" ? styles.inputText : styles.placeholderText}>
                                                {displayDecimalTime(form.start)}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.halfInput}>
                                        <Text style={styles.label}>เวลาจบ</Text>
                                        <TouchableOpacity style={styles.inputBox} onPress={() => setStudyPicker("end")}>
                                            <Text style={form.end !== "" ? styles.inputText : styles.placeholderText}>
                                                {displayDecimalTime(form.end)}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                <Text style={styles.label}>สีประจำวิชา</Text>
                                <View style={styles.colorRow}>
                                    {themeColors.map((c) => (
                                        <TouchableOpacity
                                            key={c}
                                            style={[styles.colorCircle, { backgroundColor: c }, form.color === c && styles.selectedColor]}
                                            onPress={() => setForm({ ...form, color: c })}
                                        />
                                    ))}
                                </View>
                            </>
                        )}

                        {activeTab === "exam" && (
                            <>
                                <Text style={styles.label}>เลือกวิชาสอบ</Text>
                                <View style={styles.pickerContainer}>
                                    <Picker
                                        selectedValue={form.code}
                                        onValueChange={(itemValue) => {
                                            const selectedSubj = studyData.find(s => s.code === itemValue);
                                            setForm({
                                                ...form,
                                                code: itemValue,
                                                name: selectedSubj ? selectedSubj.name : ""
                                            });
                                        }}
                                    >
                                        <Picker.Item label="-- กรุณาเลือกวิชา --" value="" color="#a4b0be" />
                                        {studyData.map((s) => (
                                            <Picker.Item key={`exam-subj-${s.code}`} label={`${s.code} ${s.name}`} value={s.code} />
                                        ))}
                                    </Picker>
                                </View>

                                <Text style={styles.label}>ห้องสอบ</Text>
                                <TextInput style={styles.input} placeholder="เช่น E301" value={form.room} onChangeText={(t) => setForm({ ...form, room: t })} />

                                <Text style={styles.label}>ประเภทการสอบ</Text>
                                <View style={styles.pickerContainer}>
                                    <Picker selectedValue={form.examType} onValueChange={(v) => setForm({ ...form, examType: v })}>
                                        <Picker.Item label="สอบกลางภาค" value="mid" />
                                        <Picker.Item label="สอบปลายภาค" value="final" />
                                    </Picker>
                                </View>

                                <View style={styles.row}>
                                    <View style={{width : '100%'}}>
                                        <Text style={styles.label}>วันที่สอบ</Text>
                                        <TouchableOpacity style={styles.inputBox} onPress={() => setExamPicker("examDate")}>
                                            <Text style={form.examDate ? styles.inputText : styles.placeholderText}>
                                                {form.examDate || "เลือกวันที่"}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={{flexDirection : 'row' , gap : 5}}>
                                    <View style={styles.halfInput}>
                                        <Text style={styles.label}>เวลาเริ่มสอบ</Text>
                                        <TouchableOpacity style={styles.inputBox} onPress={() => setExamPicker("examTime_start")}>
                                            <Text style={form.examTime_start ? styles.inputText : styles.placeholderText}>
                                                {form.examTime_start || "เลือกเวลา"}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.halfInput}>
                                        <Text style={styles.label}>เวลาสิ้นสุดสอบ</Text>
                                        <TouchableOpacity style={styles.inputBox} onPress={() => setExamPicker("examTime_end")}>
                                            <Text style={form.examTime_start ? styles.inputText : styles.placeholderText}>
                                                {form.examTime_end || "เลือกเวลา"}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </>
                        )}

                        <TouchableOpacity
                            style={[styles.saveBtn, activeTab === "study" ? styles.studyBtn : styles.examBtn]}
                            onPress={onSave}
                        >
                            <Text style={styles.saveBtnText}>{isEditing ? "บันทึกการแก้ไข" : "เพิ่มข้อมูล"}</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>

            {activeTab === "study" && (
                <DateTimePickerModal
                    isVisible={studyPicker !== null}
                    mode="time"
                    onConfirm={handleConfirmStudyTime}
                    onCancel={() => setStudyPicker(null)}
                    locale="th-TH"
                />
            )}

            {activeTab === "exam" && (
                <DateTimePickerModal
                    isVisible={examPicker !== null}
                    mode={examPicker === "examDate" ? "date" : "time"}
                    onConfirm={handleConfirmExam}
                    onCancel={() => setExamPicker(null)}
                    locale="th-TH"
                />
            )}
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "flex-end",
    },
    modalBox: {
        backgroundColor: "#ffffff",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        paddingBottom: 40,
        maxHeight: "90%",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    modalTitle: {
        fontWeight: "bold",
        fontSize: 20,
        color: "#2d3436",
    },
    closeBtn: {
        padding: 8,
        backgroundColor: "#f5f6fa",
        borderRadius: 20,
    },
    closeText: {
        fontSize: 16,
        color: "#636e72",
        fontWeight: "bold",
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        color: "#2d3436",
        marginBottom: 8,
        marginTop: 12,
    },
    input: {
        borderWidth: 1,
        borderColor: "#dfe6e9",
        backgroundColor: "#fcfcfc",
        borderRadius: 12,
        padding: 14,
        fontSize: 16,
        color: "#2d3436",
    },
    inputBox: {
        borderWidth: 1,
        borderColor: "#dfe6e9",
        backgroundColor: "#fcfcfc",
        borderRadius: 12,
        padding: 14,
        justifyContent: "center",
    },
    inputText: {
        fontSize: 16,
        color: "#2d3436",
    },
    placeholderText: {
        fontSize: 16,
        color: "#a4b0be",
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: "#dfe6e9",
        borderRadius: 12,
        backgroundColor: "#fcfcfc",
        overflow: "hidden",
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    halfInput: {
        width: "48%",
    },
    colorRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 8,
    },
    colorCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginRight: 12,
        marginBottom: 12,
    },
    selectedColor: {
        borderWidth: 3,
        borderColor: "#2d3436",
    },
    saveBtn: {
        padding: 16,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 24,
    },
    studyBtn: {
        backgroundColor: "#6C5CE7",
    },
    examBtn: {
        backgroundColor: "#FF6B00",
    },
    saveBtnText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "bold",
    },
});