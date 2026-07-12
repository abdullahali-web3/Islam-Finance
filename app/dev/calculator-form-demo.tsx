import { useState } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { Stack } from 'expo-router';
import { ScreenContainer } from '@/components/ScreenContainer';
import { CalculatorForm, type FieldConfig } from '@/components/CalculatorForm';
import { demoSchema, demoDefaultValues, type DemoInput } from '@/schemas/_demo.schema';

/**
 * THROWAWAY scratch screen proving the generic CalculatorForm pattern end-to-end
 * (declare schema + fields -> render -> validate -> typed submit). Reachable at
 * /dev/calculator-form-demo, linked from Settings in __DEV__ only. Delete with the
 * demo schema once the first real calculator exists.
 */
const demoFields: FieldConfig<DemoInput>[] = [
  { name: 'fullName', label: 'Full name', type: 'text', placeholder: 'e.g. Aisha' },
  { name: 'cashOnHand', label: 'Cash on hand', type: 'number', placeholder: '0' },
  {
    name: 'currency',
    label: 'Currency',
    type: 'select',
    options: [
      { value: 'USD', label: 'USD' },
      { value: 'PKR', label: 'PKR' },
      { value: 'GBP', label: 'GBP' },
    ],
  },
];

export default function CalculatorFormDemo() {
  const [result, setResult] = useState<DemoInput | null>(null);

  return (
    <ScreenContainer>
      <Stack.Screen options={{ headerShown: true, title: 'Form demo' }} />
      <ScrollView className="flex-1" contentContainerClassName="px-4 pt-4 pb-8">
        <Text className="mb-4 text-sm text-neutral-500 dark:text-neutral-300">
          Scratch screen — proves the generic CalculatorForm (RHF + Zod). Not a real calculator.
        </Text>

        <CalculatorForm
          schema={demoSchema}
          fields={demoFields}
          defaultValues={demoDefaultValues}
          submitLabel="Submit"
          onSubmit={(values) => setResult(values)}
        />

        {result ? (
          <View className="mt-6 rounded-md bg-neutral-100 p-4 dark:bg-neutral-700">
            <Text className="mb-1 text-sm font-semibold text-neutral-900 dark:text-neutral-50">
              Parsed & validated output
            </Text>
            <Text className="text-xs text-neutral-700 dark:text-neutral-100">
              {JSON.stringify(result, null, 2)}
            </Text>
          </View>
        ) : null}
      </ScrollView>
    </ScreenContainer>
  );
}
