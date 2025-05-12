'use client';

import Image from "next/image";
import { Bars3Icon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import Link from "next/link";

export default function Header() {
  const router = useRouter();

  return (
    <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">

      {/* Wrap the entire <p> in a <Link> so the whole bar is clickable */}
      <Link href="/" className="block lg:inline-block">
        <p className="fixed left-0 top-0 flex w-full justify-center
                      border-b border-gray-300 bg-gradient-to-b from-zinc-200
                      pb-6 pt-8 backdrop-blur-2xl
                      dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit
                      lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200
                      lg:p-4 lg:dark:bg-zinc-800/30">
          &nbsp;
          <code className="font-mono font-bold">NEX4 ICT Solutions</code>
        </p>
      </Link>

      <div className="fixed bottom-0 left-0 mb-4 flex h-auto w-full items-end justify-center gap-4 bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:w-auto lg:bg-none lg:mb-0">
      <Bars3Icon
          className="w-6 h-6 text-gray-700 dark:text-white cursor-pointer"
          onClick={() => router.push('/menu')}
        />
        <Cog6ToothIcon
          className="w-6 h-6 text-gray-700 dark:text-white cursor-pointer"
          onClick={() => router.push('/settings')}
        />
      </div>
    </div>
  );
}
