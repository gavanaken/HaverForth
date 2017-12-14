What new perspective did you gain by redoing the lab in JavaScript?

- Although the subclassing-method used in my C++ implementation was interesting, the "functional appraoch" taken here demonstrated the simplicity of creating a Forth Interpreter

Can you point to one instance where the lack of types in JavaScript was damaging to your productivity?

- I had a bug for a little bit that was due to a runtime type error involving arrays and strings, having a compile-time type checker would have caught that and thrown an error, which would have been helpful!

Did JavaScript's lack of types surprise you? Or hurt you in any way? Or was it easier than C++ because you didn't have to annotate the program with types? Either answer is fine here, as long as you provide some thoughtful reflection.

- It was surprising in that as long as I remained organized, I could code in a kind of "natural" way, where types are kind of held under the same umbrella and I can throw them around as needed. It was helpful to be able to put multiple types within the association data structure because then I could limit myself to looping through that, rather than relying on a second one.

Describe a few features of programming your previous lab that you used here. For example, describe how you observed any of the following in JS:

- As discussed, lack of type declaration was helpful in some cases, and harmful in others (for debugging)
- The association array hash operated much like a std::map
