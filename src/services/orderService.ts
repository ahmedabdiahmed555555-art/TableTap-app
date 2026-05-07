import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  onSnapshot, 
  orderBy, 
  updateDoc, 
  doc, 
  Timestamp 
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { Order, OrderStatus, OperationType, FirestoreErrorInfo } from '../types';

const handleFirestoreError = (error: unknown, operationType: OperationType, path: string | null) => {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
};

export const placeOrder = async (order: Omit<Order, 'id'>) => {
  const path = 'orders';
  try {
    const docRef = await addDoc(collection(db, path), {
      ...order,
      createdAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
  const path = `orders/${orderId}`;
  try {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, { status });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
};

export const subscribeToOrders = (callback: (orders: Order[]) => void) => {
  const path = 'orders';
  const q = query(collection(db, path), orderBy('createdAt', 'desc'));
  
  return onSnapshot(q, (snapshot) => {
    const orders = snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
      createdAt: doc.data().createdAt?.toDate().toISOString() || new Date().toISOString()
    })) as Order[];
    callback(orders);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, path);
  });
};
