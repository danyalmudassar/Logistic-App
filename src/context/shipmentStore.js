import { create } from 'zustand';

export const useShipmentStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  shipments: [
    {
      id: '1',
      status: 'In Transit',
      freightType: 'Sea',
      expectedCost: 5000,
      actualCost: null,
      expectedEta: '2026-05-15',
      actualArrival: null,
      createdAt: '2026-04-20',
      label: 'Electronic Goods',
    },
    {
      id: '2',
      status: 'In Process',
      freightType: 'Air',
      expectedCost: 12000,
      actualCost: null,
      expectedEta: '2026-05-10',
      actualArrival: null,
      createdAt: '2026-05-01',
      label: 'Pharmaceuticals',
    },
    {
      id: '3',
      status: 'Completed',
      freightType: 'Sea',
      expectedCost: 8000,
      actualCost: 8500,
      expectedEta: '2026-04-30',
      actualArrival: '2026-05-02',
      createdAt: '2026-04-01',
      label: 'Machinery',
      gapReason: 'Fuel Surcharge',
    },
    {
        id: '4',
        status: 'Pending Finance',
        freightType: 'Air',
        expectedCost: 15000,
        actualCost: null,
        expectedEta: '2026-05-20',
        actualArrival: null,
        createdAt: '2026-05-04',
        label: 'Spare Parts',
      },
  ],
  addShipment: (shipment) => set((state) => ({ 
    shipments: [...state.shipments, { ...shipment, id: Math.random().toString(36).substr(2, 9) }] 
  })),
  updateShipment: (id, updates) => set((state) => ({
    shipments: state.shipments.map((s) => s.id === id ? { ...s, ...updates } : s)
  })),
}));
