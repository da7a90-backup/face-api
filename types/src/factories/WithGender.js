import { Gender } from '../ageGenderNet/types';
import { isValidProbablitiy } from '../utils/index';
export function isWithGender(obj) {
    return (obj.gender === Gender.MALE || obj.gender === Gender.FEMALE)
        && isValidProbablitiy(obj.genderProbability);
}
export function extendWithGender(sourceObj, gender, genderProbability) {
    const extension = { gender, genderProbability };
    return { ...sourceObj, ...extension };
}
