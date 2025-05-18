import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckIcon } from "lucide-react"

export default function ProPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Upgrade to Facturo Pro</h1>
        <p className="text-xl mb-12 text-gray-600">Get more features to grow your business</p>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="border rounded-lg p-6 text-left">
            <h2 className="text-xl font-bold mb-4">Free</h2>
            <p className="text-3xl font-bold mb-6">
              $0 <span className="text-base font-normal text-gray-500">/month</span>
            </p>

            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <span>Unlimited invoices</span>
              </li>
              <li className="flex items-start">
                <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <span>PDF downloads</span>
              </li>
              <li className="flex items-start">
                <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <span>WhatsApp sharing</span>
              </li>
            </ul>

            <Link href="/invoice">
              <Button variant="outline" className="w-full">
                Continue with Free
              </Button>
            </Link>
          </div>

          <div className="border rounded-lg p-6 text-left bg-blue-50 border-blue-200">
            <div className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full w-fit mb-2">
              RECOMMENDED
            </div>
            <h2 className="text-xl font-bold mb-4">Pro</h2>
            <p className="text-3xl font-bold mb-6">
              $5 <span className="text-base font-normal text-gray-500">/month</span>
            </p>

            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <span>Everything in Free</span>
              </li>
              <li className="flex items-start">
                <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <span>Custom logo</span>
              </li>
              <li className="flex items-start">
                <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <span>Invoice history</span>
              </li>
              <li className="flex items-start">
                <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <span>Client management</span>
              </li>
              <li className="flex items-start">
                <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <span>Email sending</span>
              </li>
            </ul>

            <Button className="w-full">Upgrade to Pro</Button>
          </div>
        </div>

        <p className="mt-8 text-gray-500">
          Need more features?{" "}
          <Link href="#" className="text-blue-600 hover:underline">
            Contact us
          </Link>{" "}
          for enterprise plans.
        </p>
      </div>
    </div>
  )
}
