import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  specialInstructions?: string;
  total: number;
}

export interface TableOrder {
  tableNumber: number;
  items: OrderItem[];
  tableTotal: number;
  status: 'available' | 'occupied' | 'reserved'; // Added status field
}

interface OrderState {
  tables: TableOrder[];
  grandTotal: number;
}

const initialState: OrderState = {
  tables: [],
  grandTotal: 0,
};

// Helper function to calculate totals
const calculateTotals = (table: TableOrder) => {
  const tableTotal = table.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  return {
    ...table,
    tableTotal,
    items: table.items.map(item => ({
      ...item,
      total: item.price * item.quantity
    }))
  };
};

export const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    addToOrder: (state, action: PayloadAction<{ tableNumber: number; item: OrderItem }>) => {
      const { tableNumber, item } = action.payload;
      const tableIndex = state.tables.findIndex(t => t.tableNumber === tableNumber);
      
      if (tableIndex >= 0) {
        const itemIndex = state.tables[tableIndex].items.findIndex(i => i.id === item.id);
        if (itemIndex >= 0) {
          state.tables[tableIndex].items[itemIndex].quantity += item.quantity;
        } else {
          state.tables[tableIndex].items.push({
            ...item,
            total: item.price * item.quantity
          });
        }
        state.tables[tableIndex] = calculateTotals(state.tables[tableIndex]);
        // Update status to occupied when adding items
        state.tables[tableIndex].status = 'occupied';
      } else {
        state.tables.push({
          ...calculateTotals({
            tableNumber,
            items: [{
              ...item,
              total: item.price * item.quantity
            }],
            tableTotal: 0,
            status: 'occupied'
          }),
        });
      }
      state.grandTotal = state.tables.reduce((sum, table) => sum + table.tableTotal, 0);
    },
    updateOrderItem: (state, action: PayloadAction<{ tableNumber: number; itemId: string; updates: Partial<OrderItem> }>) => {
      const { tableNumber, itemId, updates } = action.payload;
      const tableIndex = state.tables.findIndex(t => t.tableNumber === tableNumber);
      
      if (tableIndex >= 0) {
        const itemIndex = state.tables[tableIndex].items.findIndex(i => i.id === itemId);
        if (itemIndex >= 0) {
          state.tables[tableIndex].items[itemIndex] = {
            ...state.tables[tableIndex].items[itemIndex],
            ...updates
          };
          state.tables[tableIndex] = calculateTotals(state.tables[tableIndex]);
          state.grandTotal = state.tables.reduce((sum, table) => sum + table.tableTotal, 0);
        }
      }
    },
    removeFromOrder: (state, action: PayloadAction<{ tableNumber: number; itemId: string }>) => {
      const { tableNumber, itemId } = action.payload;
      const tableIndex = state.tables.findIndex(t => t.tableNumber === tableNumber);
      
      if (tableIndex >= 0) {
        state.tables[tableIndex].items = state.tables[tableIndex].items.filter(i => i.id !== itemId);
        
        if (state.tables[tableIndex].items.length === 0) {
          // If no items left, remove the table and set status to available
          state.tables.splice(tableIndex, 1);
        } else {
          state.tables[tableIndex] = calculateTotals(state.tables[tableIndex]);
        }
        
        state.grandTotal = state.tables.reduce((sum, table) => sum + table.tableTotal, 0);
      }
    },
    clearTableOrder: (state, action: PayloadAction<number>) => {
      const tableIndex = state.tables.findIndex(t => t.tableNumber === action.payload);
      if (tableIndex >= 0) {
        state.tables.splice(tableIndex, 1);
        state.grandTotal = state.tables.reduce((sum, table) => sum + table.tableTotal, 0);
      }
    },
    setTableStatus: (state, action: PayloadAction<{tableNumber: number; status: 'available' | 'occupied' | 'reserved'}>) => {
      const { tableNumber, status } = action.payload;
      const tableIndex = state.tables.findIndex(t => t.tableNumber === tableNumber);
      
      if (tableIndex >= 0) {
        state.tables[tableIndex].status = status;
      } else {
        // If table doesn't exist, create it with the specified status
        state.tables.push({
          tableNumber,
          items: [],
          tableTotal: 0,
          status
        });
      }
    },
    initializeTables: (state, action: PayloadAction<number[]>) => {
      // Initialize tables with available status
      action.payload.forEach(tableNumber => {
        const tableExists = state.tables.some(t => t.tableNumber === tableNumber);
        if (!tableExists) {
          state.tables.push({
            tableNumber,
            items: [],
            tableTotal: 0,
            status: 'available'
          });
        }
      });
    },
  },
});

export const { 
  addToOrder, 
  updateOrderItem, 
  removeFromOrder, 
  clearTableOrder, 
  setTableStatus,
  initializeTables 
} = orderSlice.actions;
export default orderSlice.reducer;