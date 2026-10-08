import { cn } from '@project/components/lib/utils';

/** Default themed avatar when the user hasn't uploaded a photo. */
export default function Avatar({ gender, className }: { gender?: 'male' | 'female'; className?: string }) {
  return gender === 'female'
    ? <img src="https://images.fillout.com/886713/3qilvz8bzw/generated-images/ooQzqi9uPmNbvvTsEW8Dpt/img_gvH9vmNRPg7xjZ_B.jpg" alt="آواتار" className={cn('rounded-full object-cover', className)} />
    : <img src="https://images.fillout.com/886713/3qilvz8bzw/generated-images/nVSWyE8R48NoVgsYBHj2Mo/img_69MKiepZigEQperd.jpg" alt="آواتار" className={cn('rounded-full object-cover', className)} />;
}
