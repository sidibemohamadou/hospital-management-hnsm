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
  type Hospitalization, type InsertHospitalization,
  users, patients, medicalRecords, appointments, staffSchedules, 
  inventoryItems, inventoryMovements, laboratoryTests, 
  financialTransactions, hospitalizations
} from "@shared/schema";
import { db } from "./db";
import { eq, like, or, and, lte, gte, sql } from "drizzle-orm";

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

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined> {
    const [user] = await db.update(users).set(updates).where(eq(users.id, id)).returning();
    return user || undefined;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  // Patients
  async getPatient(id: string): Promise<Patient | undefined> {
    const [patient] = await db.select().from(patients).where(eq(patients.id, id));
    return patient || undefined;
  }

  async createPatient(insertPatient: InsertPatient): Promise<Patient> {
    const [patient] = await db.insert(patients).values(insertPatient).returning();
    return patient;
  }

  async updatePatient(id: string, updates: Partial<InsertPatient>): Promise<Patient | undefined> {
    const [patient] = await db.update(patients).set(updates).where(eq(patients.id, id)).returning();
    return patient || undefined;
  }

  async getAllPatients(): Promise<Patient[]> {
    return await db.select().from(patients);
  }

  async searchPatients(query: string): Promise<Patient[]> {
    const searchPattern = `%${query}%`;
    return await db.select().from(patients).where(
      or(
        like(patients.firstName, searchPattern),
        like(patients.lastName, searchPattern),
        like(patients.phone, searchPattern)
      )
    );
  }

  // Medical Records
  async getMedicalRecord(id: string): Promise<MedicalRecord | undefined> {
    const [record] = await db.select().from(medicalRecords).where(eq(medicalRecords.id, id));
    return record || undefined;
  }

  async createMedicalRecord(insertRecord: InsertMedicalRecord): Promise<MedicalRecord> {
    const [record] = await db.insert(medicalRecords).values(insertRecord).returning();
    return record;
  }

  async getMedicalRecordsByPatient(patientId: string): Promise<MedicalRecord[]> {
    return await db.select().from(medicalRecords).where(eq(medicalRecords.patientId, patientId));
  }

  // Appointments
  async getAppointment(id: string): Promise<Appointment | undefined> {
    const [appointment] = await db.select().from(appointments).where(eq(appointments.id, id));
    return appointment || undefined;
  }

  async createAppointment(insertAppointment: InsertAppointment): Promise<Appointment> {
    const [appointment] = await db.insert(appointments).values(insertAppointment).returning();
    return appointment;
  }

  async updateAppointment(id: string, updates: Partial<InsertAppointment>): Promise<Appointment | undefined> {
    const [appointment] = await db.update(appointments).set(updates).where(eq(appointments.id, id)).returning();
    return appointment || undefined;
  }

  async getAllAppointments(): Promise<Appointment[]> {
    return await db.select().from(appointments);
  }

  async getAppointmentsByDate(date: string): Promise<Appointment[]> {
    return await db.select().from(appointments).where(
      sql`DATE(${appointments.appointmentDate}) = ${date}`
    );
  }

  async getAppointmentsByPatient(patientId: string): Promise<Appointment[]> {
    return await db.select().from(appointments).where(eq(appointments.patientId, patientId));
  }

  async getAppointmentsByDoctor(doctorId: string): Promise<Appointment[]> {
    return await db.select().from(appointments).where(eq(appointments.doctorId, doctorId));
  }

  // Staff Schedules
  async createStaffSchedule(insertSchedule: InsertStaffSchedule): Promise<StaffSchedule> {
    const [schedule] = await db.insert(staffSchedules).values(insertSchedule).returning();
    return schedule;
  }

  async getStaffSchedulesByUser(userId: string): Promise<StaffSchedule[]> {
    return await db.select().from(staffSchedules).where(eq(staffSchedules.userId, userId));
  }

  async getStaffSchedulesByDate(date: string): Promise<StaffSchedule[]> {
    return await db.select().from(staffSchedules).where(eq(staffSchedules.date, date));
  }

  // Inventory
  async getInventoryItem(id: string): Promise<InventoryItem | undefined> {
    const [item] = await db.select().from(inventoryItems).where(eq(inventoryItems.id, id));
    return item || undefined;
  }

  async createInventoryItem(insertItem: InsertInventoryItem): Promise<InventoryItem> {
    const [item] = await db.insert(inventoryItems).values(insertItem).returning();
    return item;
  }

  async updateInventoryItem(id: string, updates: Partial<InsertInventoryItem>): Promise<InventoryItem | undefined> {
    const [item] = await db.update(inventoryItems).set(updates).where(eq(inventoryItems.id, id)).returning();
    return item || undefined;
  }

  async getAllInventoryItems(): Promise<InventoryItem[]> {
    return await db.select().from(inventoryItems);
  }

  async getLowStockItems(): Promise<InventoryItem[]> {
    return await db.select().from(inventoryItems).where(
      lte(inventoryItems.currentStock, inventoryItems.minimumStock)
    );
  }

  async createInventoryMovement(insertMovement: InsertInventoryMovement): Promise<InventoryMovement> {
    const [movement] = await db.insert(inventoryMovements).values(insertMovement).returning();
    return movement;
  }

  // Laboratory
  async getLaboratoryTest(id: string): Promise<LaboratoryTest | undefined> {
    const [test] = await db.select().from(laboratoryTests).where(eq(laboratoryTests.id, id));
    return test || undefined;
  }

  async createLaboratoryTest(insertTest: InsertLaboratoryTest): Promise<LaboratoryTest> {
    const [test] = await db.insert(laboratoryTests).values(insertTest).returning();
    return test;
  }

  async updateLaboratoryTest(id: string, updates: Partial<InsertLaboratoryTest>): Promise<LaboratoryTest | undefined> {
    const [test] = await db.update(laboratoryTests).set(updates).where(eq(laboratoryTests.id, id)).returning();
    return test || undefined;
  }

  async getLaboratoryTestsByPatient(patientId: string): Promise<LaboratoryTest[]> {
    return await db.select().from(laboratoryTests).where(eq(laboratoryTests.patientId, patientId));
  }

  async getAllLaboratoryTests(): Promise<LaboratoryTest[]> {
    return await db.select().from(laboratoryTests);
  }

  // Financial
  async createFinancialTransaction(insertTransaction: InsertFinancialTransaction): Promise<FinancialTransaction> {
    const [transaction] = await db.insert(financialTransactions).values(insertTransaction).returning();
    return transaction;
  }

  async getAllFinancialTransactions(): Promise<FinancialTransaction[]> {
    return await db.select().from(financialTransactions);
  }

  async getTransactionsByPatient(patientId: string): Promise<FinancialTransaction[]> {
    return await db.select().from(financialTransactions).where(eq(financialTransactions.patientId, patientId));
  }

  // Hospitalizations
  async getHospitalization(id: string): Promise<Hospitalization | undefined> {
    const [hospitalization] = await db.select().from(hospitalizations).where(eq(hospitalizations.id, id));
    return hospitalization || undefined;
  }

  async createHospitalization(insertHospitalization: InsertHospitalization): Promise<Hospitalization> {
    const [hospitalization] = await db.insert(hospitalizations).values(insertHospitalization).returning();
    return hospitalization;
  }

  async updateHospitalization(id: string, updates: Partial<InsertHospitalization>): Promise<Hospitalization | undefined> {
    const [hospitalization] = await db.update(hospitalizations).set(updates).where(eq(hospitalizations.id, id)).returning();
    return hospitalization || undefined;
  }

  async getActiveHospitalizations(): Promise<Hospitalization[]> {
    return await db.select().from(hospitalizations).where(eq(hospitalizations.status, 'active'));
  }

  async getHospitalizationsByPatient(patientId: string): Promise<Hospitalization[]> {
    return await db.select().from(hospitalizations).where(eq(hospitalizations.patientId, patientId));
  }
}

export const storage = new DatabaseStorage();