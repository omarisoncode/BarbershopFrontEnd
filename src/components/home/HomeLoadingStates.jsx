import React from 'react';

export const BookingServicesSkeleton = () => (
  <div className='space-y-4'>
    <div className='app-surface-muted p-4'>
      <div className='h-12 animate-pulse rounded-2xl bg-slate-200 dark:bg-white/8' />
      <div className='mt-3 flex flex-wrap gap-2'>
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className='h-11 w-28 animate-pulse rounded-full bg-slate-200 dark:bg-white/8'
          />
        ))}
      </div>
    </div>

    <div className='grid gap-4 sm:grid-cols-2'>
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className='lux-card overflow-hidden p-0'>
          <div className='h-40 animate-pulse bg-slate-200 dark:bg-white/8 sm:h-44' />
          <div className='space-y-3 p-5'>
            <div className='h-4 w-24 animate-pulse rounded-full bg-slate-200 dark:bg-white/8' />
            <div className='h-6 w-2/3 animate-pulse rounded-full bg-slate-200 dark:bg-white/8' />
            <div className='h-4 w-full animate-pulse rounded-full bg-slate-100 dark:bg-white/5' />
            <div className='h-4 w-3/4 animate-pulse rounded-full bg-slate-100 dark:bg-white/5' />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const BookingBarbersSkeleton = () => (
  <div className='grid gap-4 md:grid-cols-2'>
    {Array.from({ length: 4 }).map((_, index) => (
      <div key={index} className='lux-card p-5'>
        <div className='flex gap-4'>
          <div className='h-16 w-16 animate-pulse rounded-2xl bg-slate-200 dark:bg-white/8' />
          <div className='flex-1 space-y-3'>
            <div className='h-4 w-1/2 animate-pulse rounded bg-slate-200 dark:bg-white/8' />
            <div className='h-3 w-3/4 animate-pulse rounded bg-slate-100 dark:bg-white/5' />
            <div className='h-3 w-2/3 animate-pulse rounded bg-slate-100 dark:bg-white/5' />
          </div>
        </div>
      </div>
    ))}
  </div>
);
