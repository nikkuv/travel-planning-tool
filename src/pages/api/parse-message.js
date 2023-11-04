import { ChatOpenAI } from "langchain/chat_models/openai";
import { PromptTemplate } from "langchain/prompts";
import { JsonOutputFunctionsParser } from "langchain/output_parsers";
import { convertSchema } from '@sodaru/yup-to-json-schema';

import itinerarySchema from '../../schema/itinerarySchema';

export const runtime = "edge";

const TEMPLATE = `
I have a travel plan to {destination} from {datefrom} to {dateto} with a budget of {currencytype} {budget} for {noofpeople} people. Please suggest an itinerary for my trip.

Input:

Destination: {destination}
Travel Dates: {datefrom} - {dateto}
Budget: {currencytype} {budget}
Number of People: {noofpeople}
`;


export default async function POST(req, res) {

  try {
    const body = await req.json();
    const messages = body.messages ?? [];
    const currentMessageContent = messages[messages.length - 1].content;

    const prompt = PromptTemplate.fromTemplate(TEMPLATE);

    // Initialize the ChatOpenAI model with your API key and desired configuration
    const model = new ChatOpenAI({
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
      temperature: 0.7,
      modelName: "gpt-4",
    });

    const jsonSchema = convertSchema(itinerarySchema);

    const functionCallingModel = model.bind({
      functions: [
        {
          name: "output_formatter",
          description: "Should always be used to properly format output",
          parameters: jsonSchema,
        },
      ],
      function_call: { name: "output_formatter" },
    });

    const chain = prompt
      .pipe(functionCallingModel)
      .pipe(new JsonOutputFunctionsParser());

    const result = await chain.invoke({
      input: currentMessageContent,
    });

    return res.json(result, { status: 200 });
  }
  catch(error) {
    return res.json({ error: error.message }, { status: 500 });
  }
}
