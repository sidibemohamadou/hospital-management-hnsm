import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, insertPatientSchema, insertMedicalRecordSchema,
  insertAppointmentSchema, insertStaffScheduleSchema, insertInventoryItemSchema,
  insertInventoryMovementSchema, insertLaboratoryTestSchema, insertFinancialTransactionSchema,
  insertHospitalizationSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await storage.getUserByUsername(username);
      
      if (!user || !user.isActive) {
        return res.status(401).json({ message: "Identifiants invalides" });
      }
      
      // In a real app, you'd validate the password hash
      // For now, we'll accept any password for demo purposes
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  // Users
  app.get("/api/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      const usersWithoutPasswords = users.map(({ password, ...user }) => user);
      res.json(usersWithoutPasswords);
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la récupération des utilisateurs" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(validatedData);
      const { password: _, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      res.status(400).json({ message: "Données utilisateur invalides" });
    }
  });

  // Patients
  app.get("/api/patients", async (req, res) => {
    try {
      const { search } = req.query;
      let patients;
      
      if (search && typeof search === 'string') {
        patients = await storage.searchPatients(search);
      } else {
        patients = await storage.getAllPatients();
      }
      
      res.json(patients);
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la récupération des patients" });
    }
  });

  app.get("/api/patients/:id", async (req, res) => {
    try {
      const patient = await storage.getPatient(req.params.id);
      if (!patient) {
        return res.status(404).json({ message: "Patient non trouvé" });
      }
      res.json(patient);
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la récupération du patient" });
    }
  });

  app.post("/api/patients", async (req, res) => {
    try {
      const validatedData = insertPatientSchema.parse(req.body);
      const patient = await storage.createPatient(validatedData);
      res.status(201).json(patient);
    } catch (error) {
      res.status(400).json({ message: "Données patient invalides" });
    }
  });

  app.put("/api/patients/:id", async (req, res) => {
    try {
      const validatedData = insertPatientSchema.partial().parse(req.body);
      const patient = await storage.updatePatient(req.params.id, validatedData);
      if (!patient) {
        return res.status(404).json({ message: "Patient non trouvé" });
      }
      res.json(patient);
    } catch (error) {
      res.status(400).json({ message: "Données patient invalides" });
    }
  });

  // Medical Records
  app.get("/api/patients/:patientId/medical-records", async (req, res) => {
    try {
      const records = await storage.getMedicalRecordsByPatient(req.params.patientId);
      res.json(records);
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la récupération des dossiers médicaux" });
    }
  });

  app.post("/api/medical-records", async (req, res) => {
    try {
      const validatedData = insertMedicalRecordSchema.parse(req.body);
      const record = await storage.createMedicalRecord(validatedData);
      res.status(201).json(record);
    } catch (error) {
      res.status(400).json({ message: "Données dossier médical invalides" });
    }
  });

  // Appointments
  app.get("/api/appointments", async (req, res) => {
    try {
      const { date, patientId, doctorId } = req.query;
      let appointments;

      if (date && typeof date === 'string') {
        appointments = await storage.getAppointmentsByDate(date);
      } else if (patientId && typeof patientId === 'string') {
        appointments = await storage.getAppointmentsByPatient(patientId);
      } else if (doctorId && typeof doctorId === 'string') {
        appointments = await storage.getAppointmentsByDoctor(doctorId);
      } else {
        appointments = await storage.getAllAppointments();
      }

      res.json(appointments);
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la récupération des rendez-vous" });
    }
  });

  app.post("/api/appointments", async (req, res) => {
    try {
      const validatedData = insertAppointmentSchema.parse(req.body);
      const appointment = await storage.createAppointment(validatedData);
      res.status(201).json(appointment);
    } catch (error) {
      res.status(400).json({ message: "Données rendez-vous invalides" });
    }
  });

  app.put("/api/appointments/:id", async (req, res) => {
    try {
      const validatedData = insertAppointmentSchema.partial().parse(req.body);
      const appointment = await storage.updateAppointment(req.params.id, validatedData);
      if (!appointment) {
        return res.status(404).json({ message: "Rendez-vous non trouvé" });
      }
      res.json(appointment);
    } catch (error) {
      res.status(400).json({ message: "Données rendez-vous invalides" });
    }
  });

  // Staff Schedules
  app.get("/api/staff-schedules", async (req, res) => {
    try {
      const { userId, date } = req.query;
      let schedules;

      if (userId && typeof userId === 'string') {
        schedules = await storage.getStaffSchedulesByUser(userId);
      } else if (date && typeof date === 'string') {
        schedules = await storage.getStaffSchedulesByDate(date);
      } else {
        schedules = [];
      }

      res.json(schedules);
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la récupération des plannings" });
    }
  });

  app.post("/api/staff-schedules", async (req, res) => {
    try {
      const validatedData = insertStaffScheduleSchema.parse(req.body);
      const schedule = await storage.createStaffSchedule(validatedData);
      res.status(201).json(schedule);
    } catch (error) {
      res.status(400).json({ message: "Données planning invalides" });
    }
  });

  // Inventory
  app.get("/api/inventory", async (req, res) => {
    try {
      const { lowStock } = req.query;
      let items;

      if (lowStock === 'true') {
        items = await storage.getLowStockItems();
      } else {
        items = await storage.getAllInventoryItems();
      }

      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la récupération de l'inventaire" });
    }
  });

  app.post("/api/inventory", async (req, res) => {
    try {
      const validatedData = insertInventoryItemSchema.parse(req.body);
      const item = await storage.createInventoryItem(validatedData);
      res.status(201).json(item);
    } catch (error) {
      res.status(400).json({ message: "Données inventaire invalides" });
    }
  });

  app.put("/api/inventory/:id", async (req, res) => {
    try {
      const validatedData = insertInventoryItemSchema.partial().parse(req.body);
      const item = await storage.updateInventoryItem(req.params.id, validatedData);
      if (!item) {
        return res.status(404).json({ message: "Article non trouvé" });
      }
      res.json(item);
    } catch (error) {
      res.status(400).json({ message: "Données inventaire invalides" });
    }
  });

  app.post("/api/inventory-movements", async (req, res) => {
    try {
      const validatedData = insertInventoryMovementSchema.parse(req.body);
      const movement = await storage.createInventoryMovement(validatedData);
      res.status(201).json(movement);
    } catch (error) {
      res.status(400).json({ message: "Données mouvement invalides" });
    }
  });

  // Laboratory
  app.get("/api/laboratory-tests", async (req, res) => {
    try {
      const { patientId } = req.query;
      let tests;

      if (patientId && typeof patientId === 'string') {
        tests = await storage.getLaboratoryTestsByPatient(patientId);
      } else {
        tests = await storage.getAllLaboratoryTests();
      }

      res.json(tests);
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la récupération des analyses" });
    }
  });

  app.post("/api/laboratory-tests", async (req, res) => {
    try {
      const validatedData = insertLaboratoryTestSchema.parse(req.body);
      const test = await storage.createLaboratoryTest(validatedData);
      res.status(201).json(test);
    } catch (error) {
      res.status(400).json({ message: "Données analyse invalides" });
    }
  });

  app.put("/api/laboratory-tests/:id", async (req, res) => {
    try {
      const validatedData = insertLaboratoryTestSchema.partial().parse(req.body);
      const test = await storage.updateLaboratoryTest(req.params.id, validatedData);
      if (!test) {
        return res.status(404).json({ message: "Analyse non trouvée" });
      }
      res.json(test);
    } catch (error) {
      res.status(400).json({ message: "Données analyse invalides" });
    }
  });

  // Financial Transactions
  app.get("/api/financial-transactions", async (req, res) => {
    try {
      const { patientId } = req.query;
      let transactions;

      if (patientId && typeof patientId === 'string') {
        transactions = await storage.getTransactionsByPatient(patientId);
      } else {
        transactions = await storage.getAllFinancialTransactions();
      }

      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la récupération des transactions" });
    }
  });

  app.post("/api/financial-transactions", async (req, res) => {
    try {
      const validatedData = insertFinancialTransactionSchema.parse(req.body);
      const transaction = await storage.createFinancialTransaction(validatedData);
      res.status(201).json(transaction);
    } catch (error) {
      res.status(400).json({ message: "Données transaction invalides" });
    }
  });

  // Hospitalizations
  app.get("/api/hospitalizations", async (req, res) => {
    try {
      const { active, patientId } = req.query;
      let hospitalizations;

      if (active === 'true') {
        hospitalizations = await storage.getActiveHospitalizations();
      } else if (patientId && typeof patientId === 'string') {
        hospitalizations = await storage.getHospitalizationsByPatient(patientId);
      } else {
        hospitalizations = [];
      }

      res.json(hospitalizations);
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la récupération des hospitalisations" });
    }
  });

  app.post("/api/hospitalizations", async (req, res) => {
    try {
      const validatedData = insertHospitalizationSchema.parse(req.body);
      const hospitalization = await storage.createHospitalization(validatedData);
      res.status(201).json(hospitalization);
    } catch (error) {
      res.status(400).json({ message: "Données hospitalisation invalides" });
    }
  });

  app.put("/api/hospitalizations/:id", async (req, res) => {
    try {
      const validatedData = insertHospitalizationSchema.partial().parse(req.body);
      const hospitalization = await storage.updateHospitalization(req.params.id, validatedData);
      if (!hospitalization) {
        return res.status(404).json({ message: "Hospitalisation non trouvée" });
      }
      res.json(hospitalization);
    } catch (error) {
      res.status(400).json({ message: "Données hospitalisation invalides" });
    }
  });

  // Dashboard stats
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const patients = await storage.getAllPatients();
      const appointments = await storage.getAllAppointments();
      const hospitalizations = await storage.getActiveHospitalizations();
      const lowStockItems = await storage.getLowStockItems();

      const today = new Date().toISOString().split('T')[0];
      const todayAppointments = appointments.filter(apt => 
        apt.appointmentDate.toISOString().startsWith(today)
      );

      const emergencyAppointments = todayAppointments.filter(apt => apt.type === 'emergency');

      const stats = {
        activePatients: patients.length,
        todayConsultations: todayAppointments.length,
        emergencies: emergencyAppointments.length,
        occupancyRate: Math.round((hospitalizations.length / 200) * 100), // Assuming 200 total beds
        lowStockAlerts: lowStockItems.length
      };

      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la récupération des statistiques" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
