import { NuqsAdapter } from 'nuqs/adapters/react'
import ServiceComponent from './ServiceComponent'

export default function Root() {
    return <NuqsAdapter>
        <ServiceComponent/>
    </NuqsAdapter>
}