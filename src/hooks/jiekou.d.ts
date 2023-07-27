import { ComputedRef, Ref } from "vue";
interface InterfaceCar {
  carName: Ref;
  carPrice: Ref;
  updateCarName: (name: string) => void;
  updateCarPrice: (price: number) => void;
  usaCarPrice: ComputedRef<string>;
}

export { InterfaceCar };
