
import { z } from 'zod';
import { insertUserSchema, insertMedicineSchema, insertHealthRecordSchema, insertMessageSchema, users, medicines, healthRecords, messages } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  auth: {
    login: {
      method: 'POST' as const,
      path: '/api/login',
      input: z.object({
        phoneNumber: z.string().min(10, "Phone number must be valid"),
        name: z.string().optional(), // Optional for login/signup flow
      }),
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        201: z.custom<typeof users.$inferSelect>(),
      },
    },
    logout: {
      method: 'POST' as const,
      path: '/api/logout',
      responses: {
        200: z.object({ message: z.string() }),
      },
    }
  },
  medicines: {
    list: {
      method: 'GET' as const,
      path: '/api/medicines',
      responses: {
        200: z.array(z.custom<typeof medicines.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/medicines',
      input: insertMedicineSchema,
      responses: {
        201: z.custom<typeof medicines.$inferSelect>(),
      },
    },
    toggleTaken: {
      method: 'PATCH' as const,
      path: '/api/medicines/:id/toggle',
      input: z.object({ taken: z.boolean() }),
      responses: {
        200: z.custom<typeof medicines.$inferSelect>(),
      },
    }
  },
  healthRecords: {
    list: {
      method: 'GET' as const,
      path: '/api/records',
      responses: {
        200: z.array(z.custom<typeof healthRecords.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/records',
      input: insertHealthRecordSchema,
      responses: {
        201: z.custom<typeof healthRecords.$inferSelect>(),
      },
    },
  },
  messages: {
    list: {
      method: 'GET' as const,
      path: '/api/messages',
      responses: {
        200: z.array(z.custom<typeof messages.$inferSelect>()),
      },
    },
    send: {
      method: 'POST' as const,
      path: '/api/messages',
      input: insertMessageSchema,
      responses: {
        201: z.custom<typeof messages.$inferSelect>(),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
