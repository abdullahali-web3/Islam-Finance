import { View, Text, TextInput, Pressable } from 'react-native';
import {
  useForm,
  Controller,
  type DefaultValues,
  type FieldValues,
  type Path,
  type Resolver,
  type SubmitHandler,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ZodType } from 'zod';

export type FieldOption = { value: string; label: string };

/**
 * Declarative description of one form field. Calculators pair this with their Zod schema:
 * the schema owns validation + types (shared with core/), this owns presentation.
 */
export type FieldConfig<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  type: 'number' | 'text' | 'select';
  placeholder?: string;
  /** Required when type === 'select'. */
  options?: FieldOption[];
};

type CalculatorFormProps<T extends FieldValues> = {
  schema: ZodType<T>;
  fields: FieldConfig<T>[];
  defaultValues: DefaultValues<T>;
  submitLabel: string;
  onSubmit: SubmitHandler<T>;
};

/**
 * Generic, schema-driven calculator form (ADR 0001). Every calculator renders through this
 * single component — never a hand-built form screen. Renders each declared field via
 * react-hook-form + Zod validation, surfaces per-field errors, and calls onSubmit with the
 * parsed, typed values.
 */
export function CalculatorForm<T extends FieldValues>({
  schema,
  fields,
  defaultValues,
  submitLabel,
  onSubmit,
}: CalculatorFormProps<T>) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<T>({
    // Zod v4's inferred input type is `unknown`, which won't unify with react-hook-form's
    // FieldValues through this generic boundary; the schema's output IS T, so the cast is sound.
    resolver: zodResolver(schema as never) as unknown as Resolver<T>,
    defaultValues,
    mode: 'onTouched',
  });

  return (
    <View>
      {fields.map((field) => (
        <Controller
          key={field.name}
          control={control}
          name={field.name}
          render={({ field: rhf }) => {
            const errorMessage = errors[field.name]?.message as string | undefined;
            return (
              <View className="mb-5">
                <Text className="mb-1.5 text-sm font-semibold text-neutral-700 dark:text-neutral-100">
                  {field.label}
                </Text>

                {field.type === 'select' ? (
                  <View className="flex-row flex-wrap gap-2">
                    {(field.options ?? []).map((opt) => {
                      const active = rhf.value === opt.value;
                      return (
                        <Pressable
                          key={opt.value}
                          onPress={() => rhf.onChange(opt.value)}
                          className={
                            active
                              ? 'rounded-md bg-green-500 px-4 py-2 dark:bg-green-600'
                              : 'rounded-md bg-neutral-100 px-4 py-2 dark:bg-neutral-700'
                          }
                        >
                          <Text
                            className={
                              active
                                ? 'text-sm font-medium text-neutral-0'
                                : 'text-sm font-medium text-neutral-700 dark:text-neutral-100'
                            }
                          >
                            {opt.label}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                ) : (
                  <TextInput
                    placeholder={field.placeholder}
                    placeholderTextColor="#8A8A85"
                    keyboardType={field.type === 'number' ? 'numeric' : 'default'}
                    value={rhf.value === undefined || rhf.value === null ? '' : String(rhf.value)}
                    onBlur={rhf.onBlur}
                    onChangeText={(text) => {
                      if (field.type === 'number') {
                        rhf.onChange(text === '' ? undefined : Number(text));
                      } else {
                        rhf.onChange(text);
                      }
                    }}
                    className="rounded-md border border-neutral-100 bg-neutral-0 px-3 py-2.5 text-base text-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-50"
                  />
                )}

                {errorMessage ? (
                  <Text className="mt-1 text-xs text-gold-600">{errorMessage}</Text>
                ) : null}
              </View>
            );
          }}
        />
      ))}

      <Pressable
        onPress={handleSubmit(onSubmit)}
        className="mt-2 items-center rounded-md bg-green-500 px-4 py-3 active:opacity-80 dark:bg-green-600"
      >
        <Text className="text-base font-semibold text-neutral-0">{submitLabel}</Text>
      </Pressable>
    </View>
  );
}
