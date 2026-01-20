# แผนการทดสอบระบบ BMI Web Application (Testing Plan)

เอกสารนี้ระบุแผนการทดสอบระบบ เพื่อให้มั่นใจว่า BMI Web Application ทำงานได้อย่างถูกต้อง มีประสิทธิภาพ และตรงตามความต้องการของผู้ใช้งาน

## 1. กลยุทธ์การทดสอบ (Testing Strategy)
เราแบ่งระดับการทดสอบออกเป็น 3 ระดับหลัก:
1.  **Unit Testing**: ทดสอบฟังก์ชันการคำนวณทางคณิตศาสตร์ (Logic) แยกออกจากส่วนแสดงผล
2.  **Integration/Component Testing**: ทดสอบการทำงานของหน้าเว็บและ Component ต่างๆ
3.  **End-to-End (E2E) Testing**: ทดสอบ Flow การใช้งานจริงของผู้ใช้ตั้งแต่ต้นจนจบ (Critical User Journeys)

## 2. เครื่องมือที่ใช้ (Tools)
- **Playwright**: สำหรับทำ E2E Testing และจำลองพฤติกรรมผู้ใช้ (Browser Automation)
- **Manual Testing**: สำหรับตรวจสอบความสวยงาม (UI/UX) และการตอบสนอง (Responsiveness)

## 3. รายละเอียดกรณีทดสอบ (Test Cases)

### 3.1 การตรวจสอบฟังก์ชันพื้นฐาน (Basic Functionality)
| Case ID | ชื่อการทดสอบ | รายละเอียด | ผลที่คาดหวัง |
| :--- | :--- | :--- | :--- |
| **TC-01** | Homepage Load | เข้าสู่หน้าแรกของเว็บไซต์ | แสดง Logo "BMITracker" และปุ่ม Login/Register |
| **TC-02** | Navigation | คลิกปุ่ม Login และ Register | เปลี่ยนหน้าไปยัง URL ที่ถูกต้อง |

### 3.2 ระบบยืนยันตัวตน (Authentication)
| Case ID | ชื่อการทดสอบ | รายละเอียด | ผลที่คาดหวัง |
| :--- | :--- | :--- | :--- |
| **TC-03** | Register Success | กรอกข้อมูลสมัครสมาชิกถูกต้อง | สมัครสำเร็จ และ Redirect ไปหน้า Login |
| **TC-04** | Login Success | กรอก Email/Password ถูกต้อง | เข้าสู่ระบบสำเร็จ และ Redirect ไปหน้า Dashboard |
| **TC-05** | Login Failure | กรอก Password ผิด | แสดงข้อความแจ้งเตือน "Invalid email or password" |
| **TC-06** | Protected Route | เข้าหน้า `/dashboard` โดยไม่ Login | ระบบต้อง Redirect กลับมาหน้า Login อัตโนมัติ |

### 3.3 การคำนวณและบันทึก BMI (Core Features)
| Case ID | ชื่อการทดสอบ | รายละเอียด | ผลที่คาดหวัง |
| :--- | :--- | :--- | :--- |
| **TC-07** | Calculate BMI | กรอกน้ำหนัก 70, ส่วนสูง 175 -> กด Calculate | แสดงผล BMI = 22.86 และสถานะ "Normal" |
| **TC-08** | Input Validation | ไม่กรอกข้อมูล หรือกรอกค่าติดลบ | แสดงข้อความแจ้งเตือนให้กรอกข้อมูลที่ถูกต้อง |
| **TC-09** | Save Record | หลังคำนวณ กดปุ่ม "Save Record" | ข้อมูลถูกบันทึกลง History Table และกราฟอัปเดต |

### 3.4 การแสดงผลและรายงาน (Dashboard & Reports)
| Case ID | ชื่อการทดสอบ | รายละเอียด | ผลที่คาดหวัง |
| :--- | :--- | :--- | :--- |
| **TC-10** | History Table | ตรวจสอบตารางประวัติ | แสดงรายการล่าสุดพร้อมวันที่, น้ำหนัก, BMI และสีสถานะที่ถูกต้อง |
| **TC-11** | BMI Trend Chart | ตรวจสอบกราฟแนวโน้ม | กราฟแสดงจุดข้อมูลถูกต้องตามประวัติที่บันทึก |
| **TC-12** | Responsive UI | เปิดเว็บในมือถือ | Navbar ย่อส่วน, ตารางเลื่อนได้ (Scrollable), Layout ไม่พัง |

## 4. วิธีการรันชุดทดสอบอัตโนมัติ (Automated Tests)
เราใช้ **Playwright** ในการรันชุดทดสอบที่เขียนไว้ในโฟลเดอร์ `tests/`

**คำสั่งรันทดสอบทั้งหมด:**
```bash
npx playwright test
```

**คำสั่งดูรายงานผลการทดสอบ (HTML Report):**
```bash
npx playwright show-report
```

**คำสั่งรันแบบเห็นหน้าจอ Browser (Headed Mode):**
```bash
npx playwright test --ui
```

## 5. บันทึกผลการทดสอบ (Test Execution Log)
*(ส่วนนี้สำหรับบันทึกผลจริง)*

- **วันที่ทดสอบล่าสุด**: 2026-01-20
- **ผู้ทดสอบ**: Automated System (Playwright)
- **สถานะ**: ✅ ผ่านทั้งหมด (5/5 Cases หลัก)
