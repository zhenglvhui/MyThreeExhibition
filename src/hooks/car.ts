/*
 * @Date: 2022-04-22 17:37:39
 * @Description:
 */
//导入ref,computed，用了就要导入，不用不需要导入
import { ref, computed, Ref, ComputedRef } from "vue";
import { InterfaceCar } from "./jiekou";
//导出一个函数
export default function (): InterfaceCar {
  //汽车名称
  const carName: Ref = ref("奔驰");
  //汽车价格
  const carPrice: Ref = ref(5000);
  //修改汽车名称的方法
  const updateCarName = (name: string) => {
    carName.value = name;
  };
  //修改汽车价格的方法
  const updateCarPrice = (price: number) => {
    carPrice.value = price;
  };
  //汽车在美国的价格
  const usaCarPrice: ComputedRef<string> = computed(() => {
    return "$" + (carPrice.value / (Math.random() + 6)).toFixed(2);
  });

  return {
    carName,
    carPrice,
    updateCarName,
    updateCarPrice,
    usaCarPrice,
  };
}
