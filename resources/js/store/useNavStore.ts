import { create } from 'zustand';

interface NavState {
    isToggle: boolean;
    toggle: () => void;
}

const useNavStore = create<NavState>((set) => ({
    isToggle: false,
    toggle: () => set((state) => ({ isToggle: !state.isToggle })),
}));

export default useNavStore;
