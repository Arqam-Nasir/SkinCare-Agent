import React, { useState } from 'react';
import { Agent, Action, Prompt } from 'react-agents';
import { z } from 'zod';

const SkinCareAdvisorAgent = () => {
  const [userProfile, setUserProfile] = useState({
    skinType: null,
    concerns: [],
    currentSeason: null,
    climate: null,
    allergies: [],
    currentProducts: [],
    lastUpdate: null
  });

  const SKIN_TYPES = {
    normal: { description: 'Well-balanced, not too oily or dry' },
    dry: { description: 'Feels tight, may have flaky patches' },
    oily: { description: 'Excess sebum, especially in T-zone' },
    combination: { description: 'Oily T-zone, dry cheeks' },
    sensitive: { description: 'Easily irritated, prone to redness' }
  };

  const SEASONS = {
    spring: {
      icon: '🌸',
      recommendations: {
        normal: {
          routine: ['Gentle cleanser', 'Light moisturizer', 'SPF 30+'],
          ingredients: ['Vitamin C', 'Niacinamide', 'Hyaluronic Acid']
        },
        dry: {
          routine: ['Cream cleanser', 'Rich moisturizer', 'SPF 30+'],
          ingredients: ['Ceramides', 'Hyaluronic Acid', 'Squalane']
        },
        oily: {
          routine: ['Gel cleanser', 'Oil-free moisturizer', 'Mattifying SPF'],
          ingredients: ['Salicylic Acid', 'Niacinamide', 'Green Tea']
        },
        combination: {
          routine: ['Balanced cleanser', 'Zone-specific moisturizer', 'SPF 30+'],
          ingredients: ['Niacinamide', 'Hyaluronic Acid', 'Zinc']
        },
        sensitive: {
          routine: ['Mild cleanser', 'Calming moisturizer', 'Physical SPF'],
          ingredients: ['Centella Asiatica', 'Ceramides', 'Panthenol']
        }
      }
    },
    summer: {
      icon: '☀️',
      recommendations: {
        normal: {
          routine: ['Light cleanser', 'Gel moisturizer', 'High SPF 50'],
          ingredients: ['Vitamin C', 'Antioxidants', 'Aloe Vera']
        },
        dry: {
          routine: ['Gentle cleanser', 'Hydrating serum', 'SPF 50'],
          ingredients: ['Hyaluronic Acid', 'Glycerin', 'Peptides']
        },
        oily: {
          routine: ['Foaming cleanser', 'Light moisturizer', 'Mattifying SPF'],
          ingredients: ['BHA', 'Niacinamide', 'Tea Tree']
        },
        combination: {
          routine: ['Gel cleanser', 'Light moisturizer', 'SPF 50'],
          ingredients: ['AHA/BHA', 'Niacinamide', 'Hyaluronic Acid']
        },
        sensitive: {
          routine: ['Sulfate-free cleanser', 'Light moisturizer', 'Mineral SPF'],
          ingredients: ['Allantoin', 'Bisabolol', 'Zinc Oxide']
        }
      }
    },
    fall: {
      icon: '🍂',
      recommendations: {
        normal: {
          routine: ['Creamy cleanser', 'Medium-weight moisturizer', 'SPF 30+'],
          ingredients: ['Peptides', 'Ceramides', 'Vitamin E']
        },
        dry: {
          routine: ['Oil cleanser', 'Heavy moisturizer', 'Facial oil', 'SPF 30+'],
          ingredients: ['Shea Butter', 'Ceramides', 'Fatty Acids']
        },
        oily: {
          routine: ['Balancing cleanser', 'Hydrating gel', 'Light oil', 'SPF 30+'],
          ingredients: ['Niacinamide', 'Hyaluronic Acid', 'Squalane']
        },
        combination: {
          routine: ['Gentle cleanser', 'Hydrating serum', 'Zone moisturizer', 'SPF 30+'],
          ingredients: ['Ceramides', 'Peptides', 'Green Tea']
        },
        sensitive: {
          routine: ['Cream cleanser', 'Barrier cream', 'Physical SPF'],
          ingredients: ['Ceramides', 'Colloidal Oatmeal', 'Centella Asiatica']
        }
      }
    },
    winter: {
      icon: '❄️',
      recommendations: {
        normal: {
          routine: ['Cream cleanser', 'Hydrating serum', 'Rich moisturizer', 'SPF 30+'],
          ingredients: ['Ceramides', 'Peptides', 'Squalane']
        },
        dry: {
          routine: ['Oil cleanser', 'Hydrating toner', 'Heavy cream', 'Sleeping mask', 'SPF 30+'],
          ingredients: ['Hyaluronic Acid', 'Ceramides', 'Oils']
        },
        oily: {
          routine: ['Gentle cleanser', 'Hydrating serum', 'Medium moisturizer', 'SPF 30+'],
          ingredients: ['Hyaluronic Acid', 'Niacinamide', 'Ceramides']
        },
        combination: {
          routine: ['Hydrating cleanser', 'Balancing toner', 'Rich moisturizer', 'SPF 30+'],
          ingredients: ['Peptides', 'Ceramides', 'Niacinamide']
        },
        sensitive: {
          routine: ['Cream cleanser', 'Barrier serum', 'Rich moisturizer', 'Physical SPF'],
          ingredients: ['Ceramides', 'Panthenol', 'Madecassoside']
        }
      }
    }
  };

  const SKIN_CONCERNS = {
    acne: {
      ingredients: ['Salicylic acid', 'Benzoyl peroxide', 'Niacinamide'],
      avoid: ['Heavy oils', 'Comedogenic ingredients'],
      products: ['Spot treatment', 'Oil-free moisturizer', 'Clay mask']
    },
    aging: {
      ingredients: ['Retinol', 'Peptides', 'Vitamin C'],
      avoid: ['Harsh exfoliants', 'Drying alcohols'],
      products: ['Eye cream', 'Antioxidant serum', 'Rich moisturizer']
    },
    pigmentation: {
      ingredients: ['Vitamin C', 'Kojic acid', 'Alpha arbutin'],
      avoid: ['Irritating ingredients', 'Fragrance'],
      products: ['Brightening serum', 'Dark spot treatment', 'SPF']
    },
    sensitivity: {
      ingredients: ['Centella asiatica', 'Ceramides', 'Panthenol'],
      avoid: ['Fragrance', 'Essential oils', 'Harsh actives'],
      products: ['Barrier repair cream', 'Gentle cleanser', 'Physical sunscreen']
    }
  };

  const generateConversationId = (componentName) => {
    return `conversation-${componentName}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const checkProductConflicts = (products) => {
    const conflicts = [];
    const conflictPairs = {
      'retinol': ['vitamin c', 'aha', 'bha'],
      'benzoyl peroxide': ['vitamin c', 'retinol'],
      'aha': ['vitamin c', 'retinol'],
      'bha': ['vitamin c', 'retinol']
    };

    products.forEach((product1, i) => {
      products.slice(i + 1).forEach(product2 => {
        Object.entries(conflictPairs).forEach(([key, conflicts]) => {
          if (product1.toLowerCase().includes(key) && 
              conflicts.some(c => product2.toLowerCase().includes(c))) {
            conflicts.push(`${product1} and ${product2} shouldn't be used together`);
          }
        });
      });
    });
    return conflicts;
  };

  const agentId = React.useMemo(() => 
    `skincare-advisor-${Math.random().toString(36).substring(2, 11)}`, []);

  return (
    <Agent key={agentId}>
      <Prompt key={generateConversationId('main-prompt')}>
        You are an expert skincare advisor with deep knowledge of ingredients, 
        product formulations, and skin conditions. Current user profile:
        
        Skin Type: {userProfile.skinType || 'Not specified'}
        Concerns: {userProfile.concerns.join(', ') || 'None specified'}
        Season: {userProfile.currentSeason ? `${SEASONS[userProfile.currentSeason].icon} ${userProfile.currentSeason}` : 'Not specified'}
        Climate: {userProfile.climate || 'Not specified'}
        
        Gather information about:
        1. Skin type and sensitivity level
        2. Specific concerns and goals
        3. Current season and climate
        4. Any known allergies or sensitivities
        5. Current skincare routine
        
        Provide evidence-based recommendations and explain the role of each product/ingredient.
      </Prompt>

      <Action
        key={generateConversationId('update-profile')}
        name="updateUserProfile"
        description="Update the user's skincare profile with new information"
        schema={z.object({
          skinType: z.enum(['normal', 'dry', 'oily', 'combination', 'sensitive']).optional(),
          concerns: z.array(z.enum(['acne', 'aging', 'pigmentation', 'sensitivity'])).optional(),
          season: z.enum(['spring', 'summer', 'fall', 'winter']).optional(),
          climate: z.enum(['humid', 'dry', 'temperate', 'tropical']).optional(),
          allergies: z.array(z.string()).optional(),
          currentProducts: z.array(z.string()).optional(),
          message: z.string()
        })}
        examples={[
          {
            skinType: 'oily',
            concerns: ['acne'],
            season: 'summer',
            message: "I've updated your profile with your skin information."
          }
        ]}
        handler={async (e) => {
          const { message, ...profileUpdates } = e.data.message.args;
          
          setUserProfile(prev => ({
            ...prev,
            ...profileUpdates,
            lastUpdate: new Date().toISOString()
          }));

          if (profileUpdates.currentProducts) {
            const conflicts = checkProductConflicts(profileUpdates.currentProducts);
            if (conflicts.length > 0) {
              await e.data.agent.say(
                `Product Compatibility Warning:\n${conflicts.join('\n')}`
              );
            }
          }

          await e.data.agent.say(message);
          await e.commit();
        }}
      />

      <Action
        key={generateConversationId('get-recommendations')}
        name="getRecommendations"
        description="Get personalized skincare recommendations"
        schema={z.object({
          requestType: z.enum(['routine', 'ingredients', 'concerns']),
          message: z.string()
        })}
        examples={[
          {
            requestType: 'complete',
            message: "Here are your personalized skincare recommendations based on your profile."
          }
        ]}

        handler={async (e) => {
          const { requestType, message } = e.data.message.args;
          const { skinType, concerns, currentSeason } = userProfile;

          if (!skinType || !currentSeason) {
            await e.data.agent.say(
              "I need to know your skin type and current season to provide personalized recommendations."
            );
            return;
          }

          const seasonalRecs = SEASONS[currentSeason].recommendations[skinType];
          const concernRecs = concerns.map(concern => 
            SKIN_CONCERNS[concern]
          ).filter(Boolean);

          const response = [
            message,
            `\nSeasonal Recommendations for ${SEASONS[currentSeason].icon} ${currentSeason}:`,
            '\nRecommended Routine:',
            ...seasonalRecs.routine,
            '\nKey Ingredients to Look For:',
            ...seasonalRecs.ingredients,
            '\nBased on Your Concerns:',
            ...concernRecs.map(concern => 
              `- ${concern.products.join(', ')}\n  Ingredients: ${concern.ingredients.join(', ')}`
            )
          ].join('\n');

          await e.data.agent.say(response);
          await e.commit();
        }}
      />

      <Action
        key={generateConversationId('seasonal-transition')}
        name="getSeasonalTransitionGuide"
        description="Get guidance for transitioning skincare routine between seasons"
        schema={z.object({
          nextSeason: z.enum(['spring', 'summer', 'fall', 'winter']),
          message: z.string()
        })}
        examples={[
          {
            nextSeason: 'fall',
            message: "Here's your personalized seasonal transition guide."
          }
        ]}
        handler={async (e) => {
          const { nextSeason, message } = e.data.message.args;
          const { skinType, currentSeason } = userProfile;

          if (!skinType || !currentSeason) {
            await e.data.agent.say(
              "I need to know your skin type and current season to provide transition guidance."
            );
            return;
          }

          const currentRecs = SEASONS[currentSeason].recommendations[skinType];
          const nextRecs = SEASONS[nextSeason].recommendations[skinType];

          const response = [
            message,
            `\nTransitioning from ${SEASONS[currentSeason].icon} ${currentSeason} to ${SEASONS[nextSeason].icon} ${nextSeason} for ${skinType} skin:`,
            '\nCurrent Routine:',
            ...currentRecs.routine,
            '\nNew Routine:',
            ...nextRecs.routine,
            '\nKey Ingredients to Focus On:',
            ...nextRecs.ingredients,
            '\nTransition Tips:',
            '- Gradually introduce changes over 2-3 weeks',
            '- Pay attention to how your skin responds',
            '- Adjust product frequency before changing products',
            '- Keep skin hydrated during the transition'
          ].join('\n');

          await e.data.agent.say(response);
          await e.commit();
        }}
      />
    </Agent>
  );
};

export default SkinCareAdvisorAgent;