import { createUnionType } from '@nestjs/graphql'
import { VehicleMileagePutModel } from '../getVehicleMileage.model'
import { VehiclesMileageUpdateError } from './vehicleMileageResponseError.model'

export const VehicleMileagePutResponse = createUnionType({
  name: 'VehicleMileagePutResponse',
  types: () => [VehicleMileagePutModel, VehiclesMileageUpdateError] as const,
  resolveType(value) {
    if ('permno' in value && value.permno !== undefined) {
      return VehicleMileagePutModel
    }

    return VehiclesMileageUpdateError
  },
})
