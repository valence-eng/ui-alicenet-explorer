import {
  Button,
  Box,
  Grid,
  GridItem,
  Text,
  HStack,
} from '@chakra-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useCallback, useState } from 'react';
import type { FieldError, Path, SubmitHandler } from 'react-hook-form';
import { useForm, useFieldArray } from 'react-hook-form';

import type { PublicTags, PublicTag, PublicTagNew, PublicTagErrors } from 'types/api/account';

import getErrorMessage from 'lib/getErrorMessage';
import type { ErrorType } from 'lib/hooks/useFetch';
import useFetch from 'lib/hooks/useFetch';
import useIsMobile from 'lib/hooks/useIsMobile';
import { EMAIL_REGEXP } from 'lib/validations/email';
import FormSubmitAlert from 'ui/shared/FormSubmitAlert';

import PublicTagFormAction from './PublicTagFormAction';
import PublicTagFormAddressInput from './PublicTagFormAddressInput';
import PublicTagFormComment from './PublicTagFormComment';
import PublicTagsFormInput from './PublicTagsFormInput';

type Props = {
  changeToDataScreen: (success?: boolean) => void;
  data?: PublicTag;
}

export type Inputs = {
  fullName?: string;
  email?: string;
  companyName?: string;
  companyUrl?: string;
  action: 'add' | 'report';
  tags?: string;
  addresses?: Array<{
    name: string;
    address: string;
  }>;
  comment?: string;
}

const placeholders = {
  fullName: 'Your name',
  email: 'Email',
  companyName: 'Company name',
  companyUrl: 'Company website',
  tags: 'Public tag (max 35 characters)',
  comment: 'Specify the reason for adding tags and color preference(s).',
} as Record<Path<Inputs>, string>;

const ADDRESS_INPUT_BUTTONS_WIDTH = 100;

const PublicTagsForm = ({ changeToDataScreen, data }: Props) => {
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();
  const fetch = useFetch();
  const inputSize = isMobile ? 'md' : 'lg';

  const { control, handleSubmit, formState: { errors, isValid }, setError } = useForm<Inputs>({
    defaultValues: {
      fullName: data?.full_name || '',
      email: data?.email || '',
      companyName: data?.company || '',
      companyUrl: data?.website || '',
      tags: data?.tags.split(';').map((tag) => tag).join('; ') || '',
      addresses: data?.addresses.map((address, index: number) => ({ name: `address.${ index }.address`, address })) ||
        [ { name: 'address.0.address', address: '' } ],
      comment: data?.additional_comment || '',
      action: data?.is_owner === undefined || data?.is_owner ? 'add' : 'report',
    },
    mode: 'all',
  });

  const { fields, append, remove } = useFieldArray({
    name: 'addresses',
    control,
  });

  const [ isAlertVisible, setAlertVisible ] = useState(false);

  const onAddFieldClick = useCallback(() => append({ address: '', name: '' }), [ append ]);

  const onRemoveFieldClick = useCallback((index: number) => () => remove(index), [ remove ]);

  const updatePublicTag = (formData: Inputs) => {
    const body: PublicTagNew = {
      full_name: formData.fullName || '',
      email: formData.email || '',
      company: formData.companyName || '',
      website: formData.companyUrl || '',
      is_owner: formData.action === 'add',
      addresses: formData.addresses?.map(({ address }) => address) || [],
      tags: formData.tags?.split(';').map((s) => s.trim()).join(';') || '',
      additional_comment: formData.comment || '',
    };

    if (!data?.id) {
      return fetch<PublicTag, PublicTagErrors>('/api/account/public-tags', { method: 'POST', body });
    }

    return fetch<PublicTag, PublicTagErrors>(`/api/account/public-tags/${ data.id }`, { method: 'PUT', body });
  };

  const mutation = useMutation(updatePublicTag, {
    onSuccess: async(data) => {
      const response = data as unknown as PublicTag;

      queryClient.setQueryData([ 'public-tags' ], (prevData: PublicTags | undefined) => {
        const isExisting = prevData && prevData.some((item) => item.id === response.id);

        if (isExisting) {
          return prevData.map((item) => {
            if (item.id === response.id) {
              return response;
            }

            return item;
          });
        }

        return [ ...(prevData || []), response ];
      });

      changeToDataScreen(true);
    },
    onError: (e: ErrorType<PublicTagErrors>) => {
      if (e.error?.full_name || e.error?.email || e.error?.tags || e.error?.addresses || e.error?.additional_comment) {
        e.error?.full_name && setError('fullName', { type: 'custom', message: getErrorMessage(e.error, 'full_name') });
        e.error?.email && setError('email', { type: 'custom', message: getErrorMessage(e.error, 'email') });
        e.error?.tags && setError('tags', { type: 'custom', message: getErrorMessage(e.error, 'tags') });
        e.error?.addresses && setError('addresses.0.address', { type: 'custom', message: getErrorMessage(e.error, 'addresses') });
        e.error?.additional_comment && setError('comment', { type: 'custom', message: getErrorMessage(e.error, 'additional_comment') });
      } else {
        setAlertVisible(true);
      }
    },
  });

  const onSubmit: SubmitHandler<Inputs> = useCallback((data) => {
    setAlertVisible(false);
    mutation.mutate(data);
  }, [ mutation ]);

  const changeToData = useCallback(() => {
    setAlertVisible(false);
    changeToDataScreen(false);
  }, [ changeToDataScreen ]);

  return (
    <Box width={{ base: 'auto', lg: `calc(100% - ${ ADDRESS_INPUT_BUTTONS_WIDTH }px)` }} maxWidth="844px">
      { isAlertVisible && <Box mb={ 4 }><FormSubmitAlert/></Box> }
      <Text size="sm" variant="secondary" paddingBottom={ 5 }>Company info</Text>
      <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} rowGap={ 4 } columnGap={ 5 }>
        <GridItem>
          <PublicTagsFormInput<Inputs>
            fieldName="fullName"
            control={ control }
            label={ placeholders.fullName }
            error={ errors.fullName }
            required
            size={ inputSize }
          />
        </GridItem>
        <GridItem>
          <PublicTagsFormInput<Inputs>
            fieldName="companyName"
            control={ control }
            label={ placeholders.companyName }
            error={ errors.companyName }
            size={ inputSize }
          />
        </GridItem>
        <GridItem>
          <PublicTagsFormInput<Inputs>
            fieldName="email"
            control={ control }
            label={ placeholders.email }
            pattern={ EMAIL_REGEXP }
            error={ errors.email }
            required
            size={ inputSize }
          />
        </GridItem>
        <GridItem>
          <PublicTagsFormInput<Inputs>
            fieldName="companyUrl"
            control={ control }
            label={ placeholders.companyUrl }
            error={ errors?.companyUrl }
            size={ inputSize }
          />
        </GridItem>
      </Grid>
      <Box marginTop={{ base: 5, lg: 8 }} marginBottom={{ base: 5, lg: 8 }}>
        <PublicTagFormAction control={ control }/>
      </Box>
      <Text size="sm" variant="secondary" marginBottom={ 5 }>Public tags (2 tags maximum, please use &quot;;&quot; as a divider)</Text>
      <Box marginBottom={ 4 }>
        <PublicTagsFormInput<Inputs>
          fieldName="tags"
          control={ control }
          label={ placeholders.tags }
          error={ errors.tags }
          required
          size={ inputSize }
        />
      </Box>
      { fields.map((field, index) => {
        return (
          <Box position="relative" key={ field.id } marginBottom={ 4 }>
            <PublicTagFormAddressInput
              control={ control }
              error={ errors?.addresses?.[index]?.address as FieldError }
              index={ index }
              fieldsLength={ fields.length }
              onAddFieldClick={ onAddFieldClick }
              onRemoveFieldClick={ onRemoveFieldClick }
              size={ inputSize }
            />
          </Box>
        );
      }) }
      <Box marginBottom={ 8 }>
        <PublicTagFormComment control={ control } error={ errors.comment } size={ inputSize }/>
      </Box>
      <HStack spacing={ 6 }>
        <Button
          size="lg"
          onClick={ handleSubmit(onSubmit) }
          disabled={ !isValid }
          isLoading={ mutation.isLoading }
        >
          Send request
        </Button>
        <Button
          size="lg"
          variant="outline"
          onClick={ changeToData }
          disabled={ mutation.isLoading }
        >
          Cancel
        </Button>
      </HStack>
    </Box>
  );
};

export default React.memo(PublicTagsForm);
