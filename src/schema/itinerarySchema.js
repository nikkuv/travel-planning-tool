import * as Yup from 'yup';

const activitySchema = Yup.object().shape({
  Morning: Yup.string().required('Morning activity is required'),
  Afternoon: Yup.string().nullable('Afternoon activity is optional'),
  Evening: Yup.string().nullable('Evening activity is optional'),
});

const daySchema = Yup.object().shape({
  Day: Yup.number().positive().required('Day number is required'),
  Activities: activitySchema.required('Activities are required'),
});

const budgetDetailSchema = Yup.object().shape({
  Accommodation: Yup.string().required('Accommodation budget is required'),
  Food: Yup.string().required('Food budget is required'),
  Transportation: Yup.string().required('Transportation budget is required'),
  Sightseeing: Yup.string().required('Sightseeing and Activities budget is required'),
  Miscellaneous: Yup.string().required('Miscellaneous budget is required'),
});

const itinerarySchema = Yup.object().shape({
  Itinerary: Yup.array().of(daySchema).required('Itinerary is required'),
  Budget: budgetDetailSchema.required('Budget is required'),
});

export default itinerarySchema;
