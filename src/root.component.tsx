import { NuqsAdapter } from "nuqs/adapters/react";
// import ServiceComponent from './ServiceComponent'
import ServiceComponent from "./ServiceWithStateMachine";

export default function Root() {
  return (
    <NuqsAdapter>
      <ServiceComponent />
    </NuqsAdapter>
  );
}
