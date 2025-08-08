import { 
  type User, type InsertUser, 
  type Patient, type InsertPatient,
  type MedicalRecord, type InsertMedicalRecord,
  type Appointment, type InsertAppointment,
  type StaffSchedule, type InsertStaffSchedule,
  type InventoryItem, type InsertInventoryItem,
  type InventoryMovement, type InsertInventoryMovement,
  type LaboratoryTest, type InsertLaboratoryTest,
  type FinancialTransaction, type InsertFinancialTransaction,
  type Hospitalization, type InsertHospitalization
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;

  // Patients
  getPatient(id: string): Promise<Patient | undefined>;
  createPatient(patient: InsertPatient): Promise<Patient>;
  updatePatient(id: string, updates: Partial<InsertPatient>): Promise<Patient | undefined>;
  getAllPatients(): Promise<Patient[]>;
  searchPatients(query: string): Promise<Patient[]>;

  // Medical Records
  getMedicalRecord(id: string): Promise<MedicalRecord | undefined>;
  createMedicalRecord(record: InsertMedicalRecord): Promise<MedicalRecord>;
  getMedicalRecordsByPatient(patientId: string): Promise<MedicalRecord[]>;

  // Appointments
  getAppointment(id: string): Promise<Appointment | undefined>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointment(id: string, updates: Partial<InsertAppointment>): Promise<Appointment | undefined>;
  getAllAppointments(): Promise<Appointment[]>;
  getAppointmentsByDate(date: string): Promise<Appointment[]>;
  getAppointmentsByPatient(patientId: string): Promise<Appointment[]>;
  getAppointmentsByDoctor(doctorId: string): Promise<Appointment[]>;

  // Staff Schedules
  createStaffSchedule(schedule: InsertStaffSchedule): Promise<StaffSchedule>;
  getStaffSchedulesByUser(userId: string): Promise<StaffSchedule[]>;
  getStaffSchedulesByDate(date: string): Promise<StaffSchedule[]>;

  // Inventory
  getInventoryItem(id: string): Promise<InventoryItem | undefined>;
  createInventoryItem(item: InsertInventoryItem): Promise<InventoryItem>;
  updateInventoryItem(id: string, updates: Partial<InsertInventoryItem>): Promise<InventoryItem | undefined>;
  getAllInventoryItems(): Promise<InventoryItem[]>;
  getLowStockItems(): Promise<InventoryItem[]>;
  createInventoryMovement(movement: InsertInventoryMovement): Promise<InventoryMovement>;

  // Laboratory
  getLaboratoryTest(id: string): Promise<LaboratoryTest | undefined>;
  createLaboratoryTest(test: InsertLaboratoryTest): Promise<LaboratoryTest>;
  updateLaboratoryTest(id: string, updates: Partial<InsertLaboratoryTest>): Promise<LaboratoryTest | undefined>;
  getLaboratoryTestsByPatient(patientId: string): Promise<LaboratoryTest[]>;
  getAllLaboratoryTests(): Promise<LaboratoryTest[]>;

  // Financial
  createFinancialTransaction(transaction: InsertFinancialTransaction): Promise<FinancialTransaction>;
  getAllFinancialTransactions(): Promise<FinancialTransaction[]>;
  getTransactionsByPatient(patientId: string): Promise<FinancialTransaction[]>;

  // Hospitalizations
  getHospitalization(id: string): Promise<Hospitalization | undefined>;
  createHospitalization(hospitalization: InsertHospitalization): Promise<Hospitalization>;
  updateHospitalization(id: string, updates: Partial<InsertHospitalization>): Promise<Hospitalization | undefined>;
  getActiveHospitalizations(): Promise<Hospitalization[]>;
  getHospitalizationsByPatient(patientId: string): Promise<Hospitalization[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private patients: Map<string, Patient> = new Map();
  private medicalRecords: Map<string, MedicalRecord> = new Map();
  private appointments: Map<string, Appointment> = new Map();
  private staffSchedules: Map<string, StaffSchedule> = new Map();
  private inventoryItems: Map<string, InventoryItem> = new Map();
  private inventoryMovements: Map<string, InventoryMovement> = new Map();
  private laboratoryTests: Map<string, LaboratoryTest> = new Map();
  private financialTransactions: Map<string, FinancialTransaction> = new Map();
  private hospitalizations: Map<string, Hospitalization> = new Map();

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // Create default admin user
    const adminId = randomUUID();
    const admin: User = {
      id: adminId,
      username: "admin",
      password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
      firstName: "Administrateur",
      lastName: "Système",
      email: "admin@hnsm.gw",
      role: "admin",
      department: "Administration",
      phone: "+245 320 1000",
      isActive: true,
      createdAt: new Date(),
    };
    this.users.set(adminId, admin);

    // Create sample doctor
    const doctorId = randomUUID();
    const doctor: User = {
      id: doctorId,
      username: "dr.santos",
      password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
      firstName: "Maria",
      lastName: "Santos",
      email: "maria.santos@hnsm.gw",
      role: "doctor",
      department: "Cardiologie",
      phone: "+245 320 1001",
      isActive: true,
      createdAt: new Date(),
    };
    this.users.set(doctorId, doctor);
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      ...insertUser,
      id,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Patient methods
  async getPatient(id: string): Promise<Patient | undefined> {
    return this.patients.get(id);
  }

  async createPatient(insertPatient: InsertPatient): Promise<Patient> {
    const id = randomUUID();
    const patient: Patient = {
      ...insertPatient,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.patients.set(id, patient);
    return patient;
  }

  async updatePatient(id: string, updates: Partial<InsertPatient>): Promise<Patient | undefined> {
    const patient = this.patients.get(id);
    if (!patient) return undefined;
    
    const updatedPatient = { ...patient, ...updates, updatedAt: new Date() };
    this.patients.set(id, updatedPatient);
    return updatedPatient;
  }

  async getAllPatients(): Promise<Patient[]> {
    return Array.from(this.patients.values());
  }

  async searchPatients(query: string): Promise<Patient[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.patients.values()).filter(patient => 
      patient.firstName.toLowerCase().includes(lowercaseQuery) ||
      patient.lastName.toLowerCase().includes(lowercaseQuery) ||
      patient.phone?.toLowerCase().includes(lowercaseQuery)
    );
  }

  // Medical Record methods
  async getMedicalRecord(id: string): Promise<MedicalRecord | undefined> {
    return this.medicalRecords.get(id);
  }

  async createMedicalRecord(insertRecord: InsertMedicalRecord): Promise<MedicalRecord> {
    const id = randomUUID();
    const record: MedicalRecord = {
      ...insertRecord,
      id,
      createdAt: new Date(),
    };
    this.medicalRecords.set(id, record);
    return record;
  }

  async getMedicalRecordsByPatient(patientId: string): Promise<MedicalRecord[]> {
    return Array.from(this.medicalRecords.values()).filter(record => record.patientId === patientId);
  }

  // Appointment methods
  async getAppointment(id: string): Promise<Appointment | undefined> {
    return this.appointments.get(id);
  }

  async createAppointment(insertAppointment: InsertAppointment): Promise<Appointment> {
    const id = randomUUID();
    const appointment: Appointment = {
      ...insertAppointment,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.appointments.set(id, appointment);
    return appointment;
  }

  async updateAppointment(id: string, updates: Partial<InsertAppointment>): Promise<Appointment | undefined> {
    const appointment = this.appointments.get(id);
    if (!appointment) return undefined;
    
    const updatedAppointment = { ...appointment, ...updates, updatedAt: new Date() };
    this.appointments.set(id, updatedAppointment);
    return updatedAppointment;
  }

  async getAllAppointments(): Promise<Appointment[]> {
    return Array.from(this.appointments.values());
  }

  async getAppointmentsByDate(date: string): Promise<Appointment[]> {
    return Array.from(this.appointments.values()).filter(appointment => 
      appointment.appointmentDate.toISOString().startsWith(date)
    );
  }

  async getAppointmentsByPatient(patientId: string): Promise<Appointment[]> {
    return Array.from(this.appointments.values()).filter(appointment => appointment.patientId === patientId);
  }

  async getAppointmentsByDoctor(doctorId: string): Promise<Appointment[]> {
    return Array.from(this.appointments.values()).filter(appointment => appointment.doctorId === doctorId);
  }

  // Staff Schedule methods
  async createStaffSchedule(insertSchedule: InsertStaffSchedule): Promise<StaffSchedule> {
    const id = randomUUID();
    const schedule: StaffSchedule = {
      ...insertSchedule,
      id,
      createdAt: new Date(),
    };
    this.staffSchedules.set(id, schedule);
    return schedule;
  }

  async getStaffSchedulesByUser(userId: string): Promise<StaffSchedule[]> {
    return Array.from(this.staffSchedules.values()).filter(schedule => schedule.userId === userId);
  }

  async getStaffSchedulesByDate(date: string): Promise<StaffSchedule[]> {
    return Array.from(this.staffSchedules.values()).filter(schedule => schedule.date === date);
  }

  // Inventory methods
  async getInventoryItem(id: string): Promise<InventoryItem | undefined> {
    return this.inventoryItems.get(id);
  }

  async createInventoryItem(insertItem: InsertInventoryItem): Promise<InventoryItem> {
    const id = randomUUID();
    const item: InventoryItem = {
      ...insertItem,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.inventoryItems.set(id, item);
    return item;
  }

  async updateInventoryItem(id: string, updates: Partial<InsertInventoryItem>): Promise<InventoryItem | undefined> {
    const item = this.inventoryItems.get(id);
    if (!item) return undefined;
    
    const updatedItem = { ...item, ...updates, updatedAt: new Date() };
    this.inventoryItems.set(id, updatedItem);
    return updatedItem;
  }

  async getAllInventoryItems(): Promise<InventoryItem[]> {
    return Array.from(this.inventoryItems.values());
  }

  async getLowStockItems(): Promise<InventoryItem[]> {
    return Array.from(this.inventoryItems.values()).filter(item => item.currentStock <= item.minimumStock);
  }

  async createInventoryMovement(insertMovement: InsertInventoryMovement): Promise<InventoryMovement> {
    const id = randomUUID();
    const movement: InventoryMovement = {
      ...insertMovement,
      id,
      createdAt: new Date(),
    };
    this.inventoryMovements.set(id, movement);
    
    // Update item stock
    const item = this.inventoryItems.get(insertMovement.itemId);
    if (item) {
      const newStock = insertMovement.type === 'in' 
        ? item.currentStock + insertMovement.quantity
        : item.currentStock - insertMovement.quantity;
      await this.updateInventoryItem(insertMovement.itemId, { currentStock: Math.max(0, newStock) });
    }
    
    return movement;
  }

  // Laboratory methods
  async getLaboratoryTest(id: string): Promise<LaboratoryTest | undefined> {
    return this.laboratoryTests.get(id);
  }

  async createLaboratoryTest(insertTest: InsertLaboratoryTest): Promise<LaboratoryTest> {
    const id = randomUUID();
    const test: LaboratoryTest = {
      ...insertTest,
      id,
      createdAt: new Date(),
    };
    this.laboratoryTests.set(id, test);
    return test;
  }

  async updateLaboratoryTest(id: string, updates: Partial<InsertLaboratoryTest>): Promise<LaboratoryTest | undefined> {
    const test = this.laboratoryTests.get(id);
    if (!test) return undefined;
    
    const updatedTest = { ...test, ...updates };
    this.laboratoryTests.set(id, updatedTest);
    return updatedTest;
  }

  async getLaboratoryTestsByPatient(patientId: string): Promise<LaboratoryTest[]> {
    return Array.from(this.laboratoryTests.values()).filter(test => test.patientId === patientId);
  }

  async getAllLaboratoryTests(): Promise<LaboratoryTest[]> {
    return Array.from(this.laboratoryTests.values());
  }

  // Financial methods
  async createFinancialTransaction(insertTransaction: InsertFinancialTransaction): Promise<FinancialTransaction> {
    const id = randomUUID();
    const transaction: FinancialTransaction = {
      ...insertTransaction,
      id,
      transactionDate: insertTransaction.transactionDate || new Date(),
      createdAt: new Date(),
    };
    this.financialTransactions.set(id, transaction);
    return transaction;
  }

  async getAllFinancialTransactions(): Promise<FinancialTransaction[]> {
    return Array.from(this.financialTransactions.values());
  }

  async getTransactionsByPatient(patientId: string): Promise<FinancialTransaction[]> {
    return Array.from(this.financialTransactions.values()).filter(transaction => transaction.patientId === patientId);
  }

  // Hospitalization methods
  async getHospitalization(id: string): Promise<Hospitalization | undefined> {
    return this.hospitalizations.get(id);
  }

  async createHospitalization(insertHospitalization: InsertHospitalization): Promise<Hospitalization> {
    const id = randomUUID();
    const hospitalization: Hospitalization = {
      ...insertHospitalization,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.hospitalizations.set(id, hospitalization);
    return hospitalization;
  }

  async updateHospitalization(id: string, updates: Partial<InsertHospitalization>): Promise<Hospitalization | undefined> {
    const hospitalization = this.hospitalizations.get(id);
    if (!hospitalization) return undefined;
    
    const updatedHospitalization = { ...hospitalization, ...updates, updatedAt: new Date() };
    this.hospitalizations.set(id, updatedHospitalization);
    return updatedHospitalization;
  }

  async getActiveHospitalizations(): Promise<Hospitalization[]> {
    return Array.from(this.hospitalizations.values()).filter(hospitalization => hospitalization.status === 'active');
  }

  async getHospitalizationsByPatient(patientId: string): Promise<Hospitalization[]> {
    return Array.from(this.hospitalizations.values()).filter(hospitalization => hospitalization.patientId === patientId);
  }
}

export const storage = new MemStorage();
