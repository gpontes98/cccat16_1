import { validateUUID } from "../../src/validations/validateUUID";

test.each(["2a38a02a-366f-41bc-a299-8c009bf31f60", "3c3ba551-7118-44f2-b080-509520f012f1", "b71f6d3c-cac7-441a-a4f2-1f8408557ef5"])(
    "Deve testar um uuid válido: %s",
    function (uuid: string) {
        expect(validateUUID(uuid)).toBe(true);
    }
);

test.each(["gabrielgmail.com", "123", "@gmail.com"])(
    "Deve testar um uuid inválido: %s",
    function (uuid: string) {
        expect(validateUUID(uuid)).toBe(false);
    }
);
