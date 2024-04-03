import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cn from 'classnames';
import { ChangeEvent, DragEvent, Fragment, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import {
  ACCEPTED_IMAGE_TYPES,
  CreateRecipeFormData,
  createRecipeSchema,
} from '@/Forms';
import { Image } from '@/components/Elements';

import { CloudUpload } from './CloudUpload';

type Props = {
  existingImage?: string;
};

export const ImageUpload = ({ existingImage }: Props) => {
  const {
    register,
    setValue,
    formState: { errors },
    setError,
  } = useFormContext<CreateRecipeFormData>(); // retrieve all hook methods
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    if (existingImage) {
      setPreviewUrl(existingImage);
    }
  }, [existingImage]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      updateImage(files[0]);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setValue('image', null);
    setPreviewUrl('');
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Prevent default to allow drop
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      updateImage(files[0]);
    }
  };

  const updateImage = (file: File) => {
    const result = createRecipeSchema.shape.image.safeParse(file);

    if (!result.success) {
      setErrorMessage(result.error.issues[0].message);
      setImage(null);
      setPreviewUrl('');
      setValue('image', null);
      return;
    }

    setErrorMessage('');
    setImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    setValue('image', file);
  };

  useEffect(() => {
    if (errors.image) {
      setErrorMessage(errors.image.message as string);
    }
  }, [errors.image]);

  return (
    <div className="w-full h-full">
      <label
        htmlFor="image"
        style={{
          height: 'inherit',
        }}
        onClick={(e) => {
          if (previewUrl) {
            e.preventDefault();
          }
        }}
      >
        {!previewUrl ? (
          <Fragment>
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className={cn(
                ' hover:cursor-pointer border-dashed border-4 border-gap-4 p-4 rounded-lg flex justify-center flex-col items-center',
                { 'h-full': true },
                { 'border-red-500': errors.image },
                { 'border-gray-300': !errors.image }
              )}
            >
              <CloudUpload height={24} width={24} strokeWidth={3} />
              <span className="text-center">
                <b>Click to upload</b> or drag and drop
                {errorMessage ? (
                  <p className="mt-4 flex justify-center text-red-500 text-sm ">
                    {errorMessage}
                  </p>
                ) : (
                  <p className="mt-4 text-gray-600 text-sm">
                    Max file size: 5MB | Accepted file types:{' '}
                    {ACCEPTED_IMAGE_TYPES.join(', ').replace(/image\//gim, '')}
                  </p>
                )}
              </span>
            </div>
          </Fragment>
        ) : (
          <div
            className="flex relative justify-center"
            style={{
              height: 'inherit',
            }}
          >
            <Image
              src={previewUrl}
              alt={image?.name}
              className="w-full h-full object-cover rounded"
            />

            <div className="absolute right-2 top-2 cursor-pointer ">
              <FontAwesomeIcon
                icon={faXmark}
                size="2xl"
                onClick={() => {
                  setError('image', { message: 'Image is required' });
                  handleRemoveImage();
                }}
                color="#30be76"
              />
            </div>
          </div>
        )}

        <input
          {...register('image')}
          type="file"
          onChange={handleFileChange}
          accept="capture=camera,image/*"
          className="hidden"
          id="image"
        />
      </label>
    </div>
  );
};
