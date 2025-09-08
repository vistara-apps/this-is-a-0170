import React from 'react'
import { Check, Star, Zap, Crown } from 'lucide-react'

export const SubscriptionPlans = ({ currentTier, onUpgrade }) => {
  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      period: 'forever',
      icon: <Star className="w-6 h-6" />,
      description: 'Perfect for getting started with basic pet sound analysis',
      features: [
        'Basic sound library access',
        'Up to 5 sound analyses per month',
        'Common vocalization meanings',
        'Basic pet profile'
      ],
      limitations: [
        'Limited analysis depth',
        'No abnormal sound alerts',
        'No behavioral tracking'
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '$5',
      period: 'per month',
      icon: <Zap className="w-6 h-6" />,
      description: 'Enhanced features for dedicated pet parents',
      features: [
        'Everything in Free',
        'Unlimited sound analyses',
        'Advanced contextual analysis',
        'Abnormal sound detection & alerts',
        'Basic behavioral pattern tracking',
        'Multiple pet profiles',
        'Email support'
      ],
      popular: true
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$10',
      period: 'per month',
      icon: <Crown className="w-6 h-6" />,
      description: 'Complete solution for serious pet health monitoring',
      features: [
        'Everything in Premium',
        'Personalized deep dive reports',
        'Advanced trend analysis',
        'Health pattern recognition',
        'Veterinarian sharing tools',
        'Priority support',
        'Custom sound training',
        'Export data capabilities'
      ]
    }
  ]

  return (
    <div className="p-4 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Plan</h2>
        <p className="text-gray-600">Unlock deeper insights into your pet's communication</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            currentTier={currentTier}
            onUpgrade={onUpgrade}
          />
        ))}
      </div>

      {/* Feature Comparison */}
      <div className="bg-surface rounded-lg shadow-card p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Feature Comparison</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 font-medium text-gray-900">Feature</th>
                <th className="text-center py-3 font-medium text-gray-900">Free</th>
                <th className="text-center py-3 font-medium text-gray-900">Premium</th>
                <th className="text-center py-3 font-medium text-gray-900">Pro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                { feature: 'Sound Library Access', free: 'Basic', premium: 'Full', pro: 'Full + Custom' },
                { feature: 'Monthly Analyses', free: '5', premium: 'Unlimited', pro: 'Unlimited' },
                { feature: 'Contextual Analysis', free: '❌', premium: '✅', pro: '✅' },
                { feature: 'Abnormal Sound Alerts', free: '❌', premium: '✅', pro: '✅' },
                { feature: 'Behavioral Tracking', free: '❌', premium: 'Basic', pro: 'Advanced' },
                { feature: 'Trend Reports', free: '❌', premium: '❌', pro: '✅' },
                { feature: 'Vet Sharing Tools', free: '❌', premium: '❌', pro: '✅' },
                { feature: 'Priority Support', free: '❌', premium: '❌', pro: '✅' }
              ].map((row, index) => (
                <tr key={index}>
                  <td className="py-3 text-gray-900">{row.feature}</td>
                  <td className="py-3 text-center text-gray-600">{row.free}</td>
                  <td className="py-3 text-center text-gray-600">{row.premium}</td>
                  <td className="py-3 text-center text-gray-600">{row.pro}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Frequently Asked Questions</h3>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-1">Can I change my plan anytime?</h4>
            <p className="text-sm text-gray-600">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-1">What happens to my data if I downgrade?</h4>
            <p className="text-sm text-gray-600">Your data is preserved, but access to premium features will be limited based on your new plan.</p>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-1">How accurate is the AI analysis?</h4>
            <p className="text-sm text-gray-600">Our AI achieves 85-95% accuracy for common pet vocalizations, with higher accuracy for Premium and Pro users due to enhanced analysis algorithms.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

const PlanCard = ({ plan, currentTier, onUpgrade }) => {
  const isCurrentPlan = currentTier === plan.id
  const isUpgrade = (currentTier === 'free' && plan.id !== 'free') || 
                   (currentTier === 'premium' && plan.id === 'pro')

  return (
    <div className={`relative bg-surface rounded-lg shadow-card border p-6 ${
      plan.popular ? 'border-primary ring-2 ring-primary/20' : 'border-gray-100'
    }`}>
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
            Most Popular
          </span>
        </div>
      )}

      <div className="text-center mb-6">
        <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-3 ${
          plan.popular ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
        }`}>
          {plan.icon}
        </div>
        
        <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
        <div className="mt-2">
          <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
          <span className="text-gray-600 ml-1">/{plan.period}</span>
        </div>
        <p className="text-sm text-gray-600 mt-2">{plan.description}</p>
      </div>

      <div className="space-y-3 mb-6">
        {plan.features.map((feature, index) => (
          <div key={index} className="flex items-start space-x-3">
            <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
            <span className="text-sm text-gray-700">{feature}</span>
          </div>
        ))}
        
        {plan.limitations && plan.limitations.map((limitation, index) => (
          <div key={index} className="flex items-start space-x-3 opacity-60">
            <div className="w-5 h-5 flex items-center justify-center mt-0.5">
              <div className="w-3 h-3 border border-gray-400 rounded-full"></div>
            </div>
            <span className="text-sm text-gray-600">{limitation}</span>
          </div>
        ))}
      </div>

      <button
        onClick={() => onUpgrade(plan.id)}
        disabled={isCurrentPlan}
        className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
          isCurrentPlan
            ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
            : plan.popular
            ? 'bg-primary text-white hover:bg-primary/90'
            : 'bg-gray-900 text-white hover:bg-gray-800'
        }`}
      >
        {isCurrentPlan ? 'Current Plan' : isUpgrade ? 'Upgrade' : 'Get Started'}
      </button>
    </div>
  )
}