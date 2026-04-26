// __tests__/electionData.test.ts
/**
 * Unit tests for election data integrity
 */

import {
  ELECTION_TIMELINE,
  VOTING_STEPS,
  FAQS,
  VALID_DOCUMENTS,
  INDIAN_STATES,
  POLLING_CENTERS,
} from '../lib/electionData';

describe('ELECTION_TIMELINE', () => {
  it('contains at least 5 events', () => {
    expect(ELECTION_TIMELINE.length).toBeGreaterThanOrEqual(5);
  });

  it('each event has required fields', () => {
    ELECTION_TIMELINE.forEach((event) => {
      expect(event).toHaveProperty('id');
      expect(event).toHaveProperty('date');
      expect(event).toHaveProperty('title');
      expect(event).toHaveProperty('description');
      expect(event).toHaveProperty('status');
      expect(['completed', 'current', 'upcoming']).toContain(event.status);
    });
  });

  it('has exactly one current event', () => {
    const currentEvents = ELECTION_TIMELINE.filter((e) => e.status === 'current');
    expect(currentEvents.length).toBe(1);
  });
});

describe('VOTING_STEPS', () => {
  it('has 4 steps', () => {
    expect(VOTING_STEPS.length).toBe(4);
  });

  it('steps are numbered correctly', () => {
    VOTING_STEPS.forEach((step, i) => {
      expect(step.step).toBe(i + 1);
    });
  });

  it('each step has details array', () => {
    VOTING_STEPS.forEach((step) => {
      expect(Array.isArray(step.details)).toBe(true);
      expect(step.details.length).toBeGreaterThan(0);
    });
  });
});

describe('FAQS', () => {
  it('has at least 8 FAQs', () => {
    expect(FAQS.length).toBeGreaterThanOrEqual(8);
  });

  it('each FAQ has unique id', () => {
    const ids = FAQS.map((f) => f.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('each FAQ has required fields', () => {
    FAQS.forEach((faq) => {
      expect(faq).toHaveProperty('id');
      expect(faq).toHaveProperty('category');
      expect(faq).toHaveProperty('question');
      expect(faq).toHaveProperty('answer');
      expect(Array.isArray(faq.tags)).toBe(true);
    });
  });
});

describe('VALID_DOCUMENTS', () => {
  it('covers all required categories', () => {
    const allCategories = new Set(VALID_DOCUMENTS.flatMap((d) => d.categories));
    expect(allCategories.has('identity')).toBe(true);
    expect(allCategories.has('address')).toBe(true);
    expect(allCategories.has('age')).toBe(true);
  });
});

describe('INDIAN_STATES', () => {
  it('includes major states', () => {
    expect(INDIAN_STATES).toContain('Delhi');
    expect(INDIAN_STATES).toContain('Maharashtra');
    expect(INDIAN_STATES).toContain('Uttar Pradesh');
  });

  it('has at least 28 entries', () => {
    expect(INDIAN_STATES.length).toBeGreaterThanOrEqual(28);
  });
});

describe('POLLING_CENTERS', () => {
  it('each center has valid coordinates', () => {
    POLLING_CENTERS.forEach((center) => {
      expect(center.lat).toBeGreaterThan(0);
      expect(center.lng).toBeGreaterThan(0);
      expect(center.pincode).toMatch(/^\d{6}$/);
    });
  });
});
