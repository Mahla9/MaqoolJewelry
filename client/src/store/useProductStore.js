import { create } from "zustand";

const useProductStore = create(
    (set) => ({
        products: [],
        setProducts: (data) => set({products: data}),
    })
)

export default useProductStore;