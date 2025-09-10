import MockExam from "@/components/Exam/ExamView/MockExam";
import type { Questions } from "@/models/Exam/ExamQuestionsModel";
import React, { useRef } from "react";

export default function ExamContentView() {
  const downloadableContent = useRef(null);

  return (
    <div ref={downloadableContent}>
      <MockExam questions={data_mockExam_algebra_claude} />
    </div>
  );
}

const data_mockExam_algebra_claude: Questions[] = [
  // Section 1: Set Theory and Preliminaries
  {
    type: "GroupedQuestions",
    details: {
      topic: "Set Theory and Basic Operations",
      groupedQuestions: [
        {
          question:
            "Define a set using set-builder notation. Give an example of a set that contains all even integers greater than -10 and less than 20.",
          model_answer:
            "A set using set-builder notation has the form {x : x has property P}. For even integers greater than -10 and less than 20: A = {x ∈ Z : x is even, -10 < x < 20} = {-8, -6, -4, -2, 0, 2, 4, 6, 8, 10, 12, 14, 16, 18}",
          mark_allocation: 4,
        },
        {
          question:
            "Let A = {1, 2, 3, 4, 5} and B = {3, 4, 5, 6, 7}. Find A ∪ B, A ∩ B, A \\ B, and A △ B (symmetric difference).",
          model_answer:
            "A ∪ B = {1, 2, 3, 4, 5, 6, 7}; A ∩ B = {3, 4, 5}; A \\ B = {1, 2}; A △ B = (A \\ B) ∪ (B \\ A) = {1, 2} ∪ {6, 7} = {1, 2, 6, 7}",
          mark_allocation: 6,
        },
        {
          question:
            "Prove that for any sets A and B, A ∩ (B ∪ C) = (A ∩ B) ∪ (A ∩ C) (distributivity of intersection over union).",
          model_answer:
            "Let x ∈ A ∩ (B ∪ C). Then x ∈ A and x ∈ (B ∪ C). This means x ∈ A and (x ∈ B or x ∈ C). By distributivity of logical operations: (x ∈ A and x ∈ B) or (x ∈ A and x ∈ C). Therefore x ∈ (A ∩ B) or x ∈ (A ∩ C), so x ∈ (A ∩ B) ∪ (A ∩ C). The reverse inclusion follows similarly.",
          mark_allocation: 8,
        },
      ],
    },
  },

  {
    type: "mcq",
    details: {
      question: "What is the cardinality of the power set P(A) if |A| = 4?",
      choices: ["8", "16", "32", "4"],
      answerIndex: 1,
      mark_allocation: 2,
    },
  },

  {
    type: "compoundGroupedQuestions",
    details: {
      main_question: "DeMorgan's Laws and Set Complements",
      topic: "Advanced Set Operations",
      groupedQuestions: [
        {
          question:
            "State DeMorgan's first law for sets and prove it using element-wise proof.",
          model_answer:
            "DeMorgan's first law: A ∪ B = A̅ ∩ B̅. Proof: x ∈ A ∪ B ⟺ x ∉ A ∪ B ⟺ ¬(x ∈ A ∪ B) ⟺ ¬(x ∈ A or x ∈ B) ⟺ x ∉ A and x ∉ B ⟺ x ∈ A̅ and x ∈ B̅ ⟺ x ∈ A̅ ∩ B̅",
          mark_allocation: 6,
        },
        {
          question:
            "If U = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10}, A = {1, 3, 5, 7, 9}, and B = {2, 4, 6, 8}, verify DeMorgan's laws numerically.",
          model_answer:
            "A̅ = {2, 4, 6, 8, 10}, B̅ = {1, 3, 5, 7, 9, 10}, A ∪ B = {1, 2, 3, 4, 5, 6, 7, 8, 9}, A ∪ B = {10}, A̅ ∩ B̅ = {10}. First law verified. A ∩ B = ∅, A ∩ B = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10}, A̅ ∪ B̅ = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10}. Second law verified.",
          mark_allocation: 5,
        },
      ],
    },
  },

  // Section 2: Mappings and Functions
  {
    type: "GroupedQuestions",
    details: {
      topic: "Mappings and Function Properties",
      groupedQuestions: [
        {
          question:
            "Define what it means for a mapping f: A → B to be (i) injective (one-to-one), (ii) surjective (onto), and (iii) bijective.",
          model_answer:
            "(i) Injective: ∀x₁, x₂ ∈ A, if f(x₁) = f(x₂) then x₁ = x₂ (or equivalently, if x₁ ≠ x₂ then f(x₁) ≠ f(x₂)). (ii) Surjective: ∀y ∈ B, ∃x ∈ A such that f(x) = y. (iii) Bijective: f is both injective and surjective.",
          mark_allocation: 6,
        },
        {
          question:
            "Prove that if f: A → B and g: B → C are both onto functions, then g ∘ f: A → C is also onto.",
          model_answer:
            "Let z ∈ C. Since g is onto, ∃y ∈ B such that g(y) = z. Since f is onto, ∃x ∈ A such that f(x) = y. Therefore (g ∘ f)(x) = g(f(x)) = g(y) = z. Since z was arbitrary, g ∘ f is onto.",
          mark_allocation: 5,
        },
        {
          question:
            "Show that f: Z → Z defined by f(x) = 3x + 6 is injective but not surjective.",
          model_answer:
            "Injective: If f(x₁) = f(x₂), then 3x₁ + 6 = 3x₂ + 6, so 3x₁ = 3x₂, hence x₁ = x₂. Not surjective: For y = 1, we need 3x + 6 = 1, so x = -5/3 ∉ Z. Therefore 1 has no preimage in Z.",
          mark_allocation: 4,
        },
      ],
    },
  },

  {
    type: "mcq",
    details: {
      question:
        "If f: A → B is a bijection, then which of the following is true?",
      choices: [
        "f has a left inverse but no right inverse",
        "f has a right inverse but no left inverse",
        "f has both left and right inverses, and they are equal",
        "f has neither left nor right inverse",
      ],
      answerIndex: 2,
      mark_allocation: 3,
    },
  },

  // Section 3: Binary Operations and Groups
  {
    type: "compoundGroupedQuestions",
    details: {
      main_question: "Binary Operations and Group Theory",
      topic: "Algebraic Structures",
      groupedQuestions: [
        {
          question:
            "Define a binary operation on a set A. Give an example of a binary operation on the set of positive integers that is commutative but not associative.",
          model_answer:
            "A binary operation on set A is a mapping *: A × A → A that assigns to each ordered pair (a,b) ∈ A × A a unique element a * b ∈ A. Example: a * b = (a + b)/2 on positive integers. Commutative: (a + b)/2 = (b + a)/2. Not associative: (a * b) * c = ((a+b)/2 + c)/2 = (a+b+2c)/4, while a * (b * c) = (a + (b+c)/2)/2 = (2a+b+c)/4.",
          mark_allocation: 6,
        },
        {
          question:
            "Prove that (Z, +) forms a group by verifying all four group axioms.",
          model_answer:
            "(1) Closure: For any a,b ∈ Z, a + b ∈ Z. (2) Associativity: (a + b) + c = a + (b + c) for all a,b,c ∈ Z. (3) Identity: 0 ∈ Z and a + 0 = 0 + a = a for all a ∈ Z. (4) Inverse: For any a ∈ Z, -a ∈ Z and a + (-a) = (-a) + a = 0.",
          mark_allocation: 8,
        },
        {
          question:
            "Show that (Z/5Z, +) is a group and find the inverse of each element.",
          model_answer:
            "Z/5Z = {0̄, 1̄, 2̄, 3̄, 4̄}. Closure and associativity inherit from Z. Identity is 0̄. Inverses: 0̄⁻¹ = 0̄, 1̄⁻¹ = 4̄, 2̄⁻¹ = 3̄, 3̄⁻¹ = 2̄, 4̄⁻¹ = 1̄. Verification: 1̄ + 4̄ = 5̄ = 0̄, 2̄ + 3̄ = 5̄ = 0̄.",
          mark_allocation: 6,
        },
      ],
    },
  },

  // Section 4: Equivalence Relations and Congruences
  {
    type: "GroupedQuestions",
    details: {
      topic: "Equivalence Relations and Modular Arithmetic",
      groupedQuestions: [
        {
          question:
            "Define an equivalence relation. Prove that the relation R on Z defined by aRb if and only if 3|(a-b) is an equivalence relation.",
          model_answer:
            "An equivalence relation on set A is a relation that is reflexive, symmetric, and transitive. Proof: (1) Reflexive: 3|(a-a) = 3|0 ✓. (2) Symmetric: If 3|(a-b), then a-b = 3k for some k ∈ Z, so b-a = 3(-k) and 3|(b-a) ✓. (3) Transitive: If 3|(a-b) and 3|(b-c), then a-b = 3k and b-c = 3m, so a-c = (a-b)+(b-c) = 3k+3m = 3(k+m), hence 3|(a-c) ✓.",
          mark_allocation: 8,
        },
        {
          question:
            "Find all equivalence classes for the relation in the previous question and show they partition Z.",
          model_answer:
            "The equivalence classes are: [0] = {..., -6, -3, 0, 3, 6, 9, ...} = {3k : k ∈ Z}, [1] = {..., -5, -2, 1, 4, 7, 10, ...} = {3k+1 : k ∈ Z}, [2] = {..., -4, -1, 2, 5, 8, 11, ...} = {3k+2 : k ∈ Z}. These are disjoint and [0] ∪ [1] ∪ [2] = Z by the division algorithm.",
          mark_allocation: 6,
        },
        {
          question:
            "Compute 17 × 23 (mod 7) and 5⁴³ (mod 11) showing your working.",
          model_answer:
            "17 × 23 (mod 7): 17 ≡ 3 (mod 7), 23 ≡ 2 (mod 7), so 17 × 23 ≡ 3 × 2 ≡ 6 (mod 7). For 5⁴³ (mod 11): 5² ≡ 3 (mod 11), 5⁴ ≡ 9 (mod 11), 5⁸ ≡ 4 (mod 11), 5¹⁶ ≡ 5 (mod 11), 5³² ≡ 3 (mod 11). Since 43 = 32 + 8 + 2 + 1, 5⁴³ ≡ 5³² × 5⁸ × 5² × 5¹ ≡ 3 × 4 × 3 × 5 ≡ 180 ≡ 4 (mod 11).",
          mark_allocation: 8,
        },
      ],
    },
  },

  // Section 5: Permutation Groups
  {
    type: "compoundQuestion",
    details: {
      main_question:
        "Consider the permutation σ = (1 2 3 4 5 6; 3 1 5 6 2 4) in S₆.",
      sub_questions: [
        "Write σ in cycle notation.",
        "Find σ⁻¹ and express it in both array and cycle notation.",
        "Compute σ⁵ and determine the order of σ.",
        "Express σ as a product of transpositions.",
      ],
      model_answer:
        "(a) Following 1→3→5→2→1 and 4→6→4, σ = (1 3 5 2)(4 6). (b) σ⁻¹ = (2 5 3 1)(6 4) = (1 2 3 4 5 6; 2 5 1 6 3 4). (c) Since σ has cycles of lengths 4 and 2, order(σ) = lcm(4,2) = 4, so σ⁴ = e and σ⁵ = σ. (d) σ = (1 3)(3 5)(5 2)(4 6).",
      mark_allocation: 12,
    },
  },

  {
    type: "mcq",
    details: {
      question: "The order of the permutation (1 2 3)(4 5 6 7 8) in S₈ is:",
      choices: ["8", "15", "24", "40"],
      answerIndex: 1,
      mark_allocation: 3,
    },
  },

  // Section 6: Real Numbers and Completeness
  {
    type: "GroupedQuestions",
    details: {
      topic: "Completeness of Real Numbers and Suprema",
      groupedQuestions: [
        {
          question:
            "State the Least Upper Bound Property (LUBP) for real numbers. Explain why this property fails for rational numbers with a specific example.",
          model_answer:
            "LUBP: Every non-empty set of real numbers that is bounded above has a supremum (least upper bound). This fails for Q because the set A = {x ∈ Q : x² < 2} is bounded above in Q (e.g., by 2) but has no supremum in Q. The supremum should be √2, but √2 ∉ Q.",
          mark_allocation: 5,
        },
        {
          question:
            "Let A = {1 - 1/n : n ∈ N}. Find sup(A) and inf(A), and determine whether these values belong to A.",
          model_answer:
            "A = {0, 1/2, 2/3, 3/4, 4/5, ...}. Since 1 - 1/n < 1 for all n ∈ N and 1 - 1/n approaches 1 as n → ∞, sup(A) = 1. Since 1 - 1/1 = 0 is the smallest value, inf(A) = 0. We have 0 ∈ A but 1 ∉ A.",
          mark_allocation: 6,
        },
        {
          question:
            "Prove that if A ⊆ B ⊆ R and both A and B are bounded above, then sup(A) ≤ sup(B).",
          model_answer:
            "Since A ⊆ B and sup(B) is an upper bound for B, sup(B) is also an upper bound for A. Since sup(A) is the least upper bound for A, we have sup(A) ≤ sup(B).",
          mark_allocation: 4,
        },
      ],
    },
  },

  // Section 7: Sequences and Convergence
  {
    type: "compoundGroupedQuestions",
    details: {
      main_question: "Sequence Convergence and Properties",
      topic: "Real Analysis - Sequences",
      groupedQuestions: [
        {
          question:
            "Using the ε-N definition, prove that lim(n→∞) (3n + 2)/(2n - 1) = 3/2.",
          model_answer:
            "Let ε > 0. We need N such that n > N ⟹ |(3n+2)/(2n-1) - 3/2| < ε. |(3n+2)/(2n-1) - 3/2| = |(6n+4-6n+3)/(2(2n-1))| = |7/(2(2n-1))| = 7/(2(2n-1)). For this < ε, we need 7/(2(2n-1)) < ε, so 2n-1 > 7/(2ε), hence n > (7+2ε)/(4ε). Choose N = ⌈(7+2ε)/(4ε)⌉.",
          mark_allocation: 8,
        },
        {
          question: "State and prove the Squeeze Theorem for sequences.",
          model_answer:
            "Squeeze Theorem: If (aₙ), (bₙ), (cₙ) are sequences with aₙ ≤ bₙ ≤ cₙ for all n ∈ N, and lim aₙ = lim cₙ = L, then lim bₙ = L. Proof: Let ε > 0. ∃N₁: n > N₁ ⟹ |aₙ - L| < ε, ∃N₂: n > N₂ ⟹ |cₙ - L| < ε. Let N = max{N₁, N₂}. For n > N: L - ε < aₙ ≤ bₙ ≤ cₙ < L + ε, so |bₙ - L| < ε.",
          mark_allocation: 7,
        },
        {
          question:
            "Determine whether the sequence aₙ = sin(n)/√n converges, and if so, find its limit.",
          model_answer:
            "Since -1 ≤ sin(n) ≤ 1, we have -1/√n ≤ sin(n)/√n ≤ 1/√n. As n → ∞, both -1/√n → 0 and 1/√n → 0. By the Squeeze Theorem, lim(n→∞) sin(n)/√n = 0.",
          mark_allocation: 5,
        },
      ],
    },
  },

  {
    type: "mcq",
    details: {
      question:
        "Which of the following sequences is bounded but does not converge?",
      choices: ["aₙ = 1/n", "aₙ = (-1)ⁿ", "aₙ = n²", "aₙ = 1 + 1/n"],
      answerIndex: 1,
      mark_allocation: 2,
    },
  },

  // Section 8: Open and Closed Sets
  {
    type: "GroupedQuestions",
    details: {
      topic: "Topology of Real Numbers",
      groupedQuestions: [
        {
          question:
            "Define what it means for a set A ⊆ R to be open. Prove that the interval (a,b) is open for any a < b.",
          model_answer:
            "A set A ⊆ R is open if for each x ∈ A, there exists δ > 0 such that (x-δ, x+δ) ⊆ A. For (a,b): let x ∈ (a,b). Choose δ = min{x-a, b-x} > 0. Then (x-δ, x+δ) ⊆ (a,b) since x-δ ≥ a and x+δ ≤ b.",
          mark_allocation: 6,
        },
        {
          question: "Prove that an arbitrary union of open sets is open.",
          model_answer:
            "Let {Aᵢ : i ∈ I} be open sets and A = ⋃ᵢ∈I Aᵢ. If x ∈ A, then x ∈ Aᵢ₀ for some i₀ ∈ I. Since Aᵢ₀ is open, ∃δ > 0 such that (x-δ, x+δ) ⊆ Aᵢ₀ ⊆ A. Therefore A is open.",
          mark_allocation: 5,
        },
        {
          question:
            "Find the interior, closure, and boundary of the set A = {1/n : n ∈ N} ∪ {0}.",
          model_answer:
            "A° = ∅ (no point in A has a neighborhood contained in A). Ā = A ∪ {0} = A (since 0 is a limit point of {1/n}). bd(A) = A (every point is a boundary point since any neighborhood contains points in and outside A).",
          mark_allocation: 7,
        },
      ],
    },
  },

  // Section 9: Limits and Continuity of Functions
  {
    type: "compoundGroupedQuestions",
    details: {
      main_question: "Function Limits and Continuity",
      topic: "Real Analysis - Functions",
      groupedQuestions: [
        {
          question:
            "Using the ε-δ definition, prove that lim(x→2) (x² - 4)/(x - 2) = 4.",
          model_answer:
            "For x ≠ 2, (x²-4)/(x-2) = (x+2)(x-2)/(x-2) = x+2. Let ε > 0. We need δ > 0 such that 0 < |x-2| < δ ⟹ |x+2-4| = |x-2| < ε. Choose δ = ε. Then 0 < |x-2| < δ ⟹ |(x²-4)/(x-2) - 4| = |x-2| < δ = ε.",
          mark_allocation: 6,
        },
        {
          question:
            "Prove that f(x) = √x is continuous on (0,∞) using the ε-δ definition.",
          model_answer:
            "Let c > 0 and ε > 0. |√x - √c| = |x-c|/(√x + √c) ≤ |x-c|/√c (since √x > 0). For |√x - √c| < ε, we need |x-c|/√c < ε, so |x-c| < ε√c. Choose δ = ε√c. Then |x-c| < δ ⟹ |√x - √c| < ε.",
          mark_allocation: 7,
        },
        {
          question:
            "Show that f(x) = 1/x is not uniformly continuous on (0,1).",
          model_answer:
            "Consider sequences xₙ = 1/n and yₙ = 1/(n+1). Then |xₙ - yₙ| = |1/n - 1/(n+1)| = 1/(n(n+1)) → 0, but |f(xₙ) - f(yₙ)| = |n - (n+1)| = 1 ≥ 1. By the negation of uniform continuity, f is not uniformly continuous on (0,1).",
          mark_allocation: 6,
        },
      ],
    },
  },

  // Section 10: Power Series
  {
    type: "GroupedQuestions",
    details: {
      topic: "Power Series and Convergence",
      groupedQuestions: [
        {
          question:
            "Find the radius of convergence of the power series ∑(n=0 to ∞) nxⁿ.",
          model_answer:
            "Using the ratio test: |aₙ₊₁/aₙ| = |(n+1)/n| = (n+1)/n → 1 as n → ∞. Therefore R = 1/1 = 1. The series converges for |x| < 1 and diverges for |x| > 1.",
          mark_allocation: 5,
        },
        {
          question:
            "Determine the interval of convergence for ∑(n=1 to ∞) xⁿ/n including endpoint analysis.",
          model_answer:
            "R = lim|aₙ/aₙ₊₁| = lim n/(n+1) = 1. At x = 1: ∑1/n diverges (harmonic series). At x = -1: ∑(-1)ⁿ/n converges (alternating harmonic series). Interval of convergence: [-1, 1).",
          mark_allocation: 6,
        },
        {
          question:
            "Find the power series representation of f(x) = 1/(1-x)² and determine its radius of convergence.",
          model_answer:
            "Since 1/(1-x) = ∑xⁿ for |x| < 1, differentiating both sides: 1/(1-x)² = ∑nxⁿ⁻¹ = ∑(n+1)xⁿ for |x| < 1. The radius of convergence is R = 1.",
          mark_allocation: 7,
        },
      ],
    },
  },

  // Section 11: Comprehensive Integration Problems
  {
    type: "compoundQuestion",
    details: {
      main_question:
        "Consider the function f: R → R defined by f(x) = |x| for all x ∈ R.",
      sub_questions: [
        "Prove that f is continuous at every point in R.",
        "Show that f is not differentiable at x = 0.",
        "Determine whether f satisfies the intermediate value property.",
        "Find the image of the interval [-2, 3] under f.",
      ],
      model_answer:
        "(a) For x ≠ 0, |f(x) - f(c)| = ||x| - |c|| ≤ |x - c| by reverse triangle inequality. Choose δ = ε. At x = 0, |f(x) - f(0)| = |x| = |x - 0|, so choose δ = ε. (b) lim(h→0⁺) (f(0+h) - f(0))/h = lim(h→0⁺) h/h = 1, but lim(h→0⁻) (f(0+h) - f(0))/h = lim(h→0⁻) (-h)/h = -1. Since left and right limits differ, f is not differentiable at 0. (c) Yes, continuous functions satisfy IVP. (d) f([-2,3]) = [0,3].",
      mark_allocation: 15,
    },
  },

  // Final comprehensive problem
  {
    type: "question",
    details: {
      question:
        "Let G = {e, a, b, c} be a group of order 4 under some operation *. Given that a² = e, b² = c, and c² = b, determine the complete multiplication table for G and prove that G is isomorphic to either Z₄ or Z₂ × Z₂.",
      model_answer:
        "Since |G| = 4 and a² = e, the order of a is 2. From b² = c and c² = b, we get b⁴ = (b²)² = c² = b, so b³ = e, meaning order of b is 3. But in a group of order 4, element orders must divide 4, so order of b must be 1, 2, or 4. Since b ≠ e, order isn't 1. If order is 2, then b² = e, contradicting b² = c ≠ e. So order of b is 4, making G cyclic. Since c = b² and c² = b = b⁻¹, we have c = b³. The multiplication table shows G = ⟨b⟩ ≅ Z₄.",
      mark_allocation: 12,
    },
  },
];

{
  /*---------------------- ----------------- ----------------- ----------------- ----------------- ----------------- ---------------- */
}
