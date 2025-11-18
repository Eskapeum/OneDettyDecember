import { WaitlistForm } from '@/components/forms/waitlist-form'

export default function WaitlistPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            OneDettyDecember
          </h1>
          <p className="text-gray-600">
            The ultimate platform for December experiences in Lagos and Accra
          </p>
        </div>
        <WaitlistForm />
      </div>
    </div>
  )
}
